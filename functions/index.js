// Coollabora Clinical - Cloud Functions (Clean Slate v2.0)
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ApifyClient } = require('apify-client');
const { AUTHORITY_AUDITOR_PROMPT } = require('./src/prompts/master_prompt.js');
const { captureWebsiteScreenshot, captureInstagramProfile } = require('./src/services/screenshotService.js');
require('dotenv').config();

admin.initializeApp();
setGlobalOptions({ maxInstances: 10 });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const APIFY_API_TOKEN = process.env.APIFY_API_KEY; // Note: .env uses APIFY_API_KEY

// DEBUG: Log env var status at startup
console.log("🔧 [ENV DEBUG] APIFY_API_TOKEN:", APIFY_API_TOKEN ? `${APIFY_API_TOKEN.substring(0, 8)}...` : "❌ MISSING");
console.log("🔧 [ENV DEBUG] GEMINI_API_KEY:", GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 8)}...` : "❌ MISSING");

// --- VISION AUDITOR PROMPT (Simplified) ---
const VISION_AUDITOR_PROMPT = `
Analyze this website screenshot and provide:
1. Aesthetic Assessment (modern vs outdated)
2. Trust signals present
3. Professional appearance score

Return JSON with:
{
  "brand_contamination_score": int 1-10,
  "aesthetic_obsolescence_score": int 1-10,
  "authority_verdict_title": string,
  "critical_analysis_paragraph": string,
  "traffic_light_status": "green" | "yellow" | "red"
}
`;

// --- MAIN FUNCTION: Authority Audit ---
exports.performAuthorityAudit = onCall({ cors: true, timeoutSeconds: 540 }, async (request) => {
    const { instagramUrl, websiteUrl } = request.data;
    if (!instagramUrl) throw new HttpsError('invalid-argument', 'Instagram URL requerida.');

    // --- SMART CACHING (30-DAY LOOKBACK) ---
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const existingAudit = await admin.firestore().collection('audits')
            .where('instagramUrl', '==', instagramUrl)
            .where('createdAt', '>', thirtyDaysAgo)
            .limit(1)
            .get();

        if (!existingAudit.empty) {
            const cacheData = existingAudit.docs[0].data();
            const hasPosts = cacheData.dataUsed?.socialMediaJson?.posts?.length > 0;

            if (hasPosts) {
                logger.info(`Serving CACHED Audit for: ${instagramUrl}`);
                return {
                    report: cacheData.report,
                    identity: cacheData.identity,
                    visionAnalysis: cacheData.visionAnalysis,
                    dataUsed: { cached: true, ...cacheData.dataUsed }
                };
            }
        }
    } catch (e) {
        logger.warn("Cache Check Failed", e);
    }

    logger.info(`Starting FRESH Audit for IG: ${instagramUrl} | Web: ${websiteUrl || 'N/A'}`);

    if (!APIFY_API_TOKEN) { logger.error("Missing Apify Token"); return { error: 'SERVER_CONFIG_ERROR' }; }
    if (!GEMINI_API_KEY) { logger.error("Missing Gemini Key"); return { error: 'SERVER_CONFIG_ERROR' }; }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: { temperature: 0.0 }
        });

        let socialMediaJson = null;
        let identity = { handle: "@unknown", fullName: "Profesional" };
        let websiteContent = "NO PROPORCIONADA";
        let screenshotUrl = null;

        // --- SCRAPE INSTAGRAM ---
        const scrapeInstagram = async () => {
            if (!instagramUrl) return null;

            let handle = instagramUrl.split('instagram.com/')[1]?.split('/')[0]?.split('?')[0];
            if (!handle) handle = "user_unknown";
            handle = handle.replace(/@/g, '');

            try {
                console.log("🔌 [APIFY] Initializing client...");
                const client = new ApifyClient({ token: APIFY_API_TOKEN });

                // Get Instagram session cookie for authenticated access
                const sessionIdRaw = process.env.INSTAGRAM_SESSION_ID;
                const sessionId = sessionIdRaw ? decodeURIComponent(sessionIdRaw) : undefined;

                let loginCookies = [];
                if (sessionId) {
                    loginCookies.push({
                        name: 'sessionid',
                        value: sessionId,
                        domain: '.instagram.com',
                        path: '/',
                        secure: true,
                        httpOnly: true,
                        sameSite: 'None'
                    });
                    console.log(`🔐 [APIFY] Using authenticated session (sessionid parameter)`);
                } else {
                    console.log(`⚠️ [APIFY] No session cookie - using public access`);
                }

                // Strategy: SEQUENTIAL PRIORITY using Instagram Profile Scraper
                // This actor uses 'usernames' instead of 'directUrls' and returns more complete data
                console.log(`🔍 [APIFY] Scraping: ${handle} using Instagram Profile Scraper`);

                let posts = [];
                let profileInfo = {
                    username: handle,
                    fullName: handle,
                    biography: "Bio no disponible",
                    followers: 0,
                    profilePic: ""
                };

                // STEP 1: Try Instagram Profile Scraper (more reliable for profile data)
                try {
                    console.log("👉 Attempting 'apify/instagram-profile-scraper'...");
                    const runProfile = await client.actor("apify/instagram-profile-scraper").call({
                        usernames: [handle],
                        includeAboutSection: false
                    });

                    const profileData = await client.dataset(runProfile.defaultDatasetId).listItems();

                    if (profileData.items && profileData.items.length > 0) {
                        const d = profileData.items[0];

                        // Check for errors
                        if (d.error) {
                            console.warn(`⚠️ [APIFY] Profile scraper returned error: ${d.error}`);
                        } else {
                            profileInfo.username = d.username || handle;
                            profileInfo.fullName = d.fullName || d.full_name || handle;
                            profileInfo.biography = d.biography || d.bio || "Bio no disponible";
                            profileInfo.followers = d.followersCount || d.followers_count || 0;
                            profileInfo.profilePic = d.profilePicUrl || d.profile_pic_url || "";

                            console.log(`✅ [APIFY] Got profile: ${profileInfo.fullName} (${profileInfo.followers} followers)`);

                            // Get posts if available
                            if (d.latestPosts && d.latestPosts.length > 0) {
                                posts = d.latestPosts.map(p => ({
                                    caption: p.caption || "",
                                    likes: p.likesCount || p.likes_count || 0,
                                    imageUrl: p.displayUrl || p.display_url || p.images?.[0] || ""
                                }));
                                console.log(`✅ [APIFY] Got ${posts.length} posts`);
                            }
                        }
                    }
                } catch (e) {
                    console.warn("⚠️ Instagram Profile Scraper failed:", e.message);
                }

                // STEP 2: Fallback to instagram-scraper with details if profile scraper failed
                if (!profileInfo.profilePic && !profileInfo.biography) {
                    console.log("👉 Fallback: Trying 'apify/instagram-scraper' with details...");
                    try {
                        const runDetails = await client.actor("apify/instagram-scraper").call({
                            directUrls: [`https://www.instagram.com/${handle}/`],
                            resultsType: "details",
                            cookies: loginCookies,
                            searchType: "user"
                        });

                        const detailsData = await client.dataset(runDetails.defaultDatasetId).listItems();

                        if (detailsData.items && detailsData.items.length > 0) {
                            const d = detailsData.items[0];
                            if (!d.error) {
                                profileInfo.username = d.username || handle;
                                profileInfo.fullName = d.fullName || handle;
                                profileInfo.biography = d.biography || "Bio no disponible";
                                profileInfo.followers = d.followersCount || 0;
                                profileInfo.profilePic = d.profilePicUrl || d.profile_pic_url || profileInfo.profilePic;

                                if (posts.length === 0 && d.latestPosts) {
                                    posts = d.latestPosts.map(p => ({
                                        caption: p.caption || "",
                                        likes: p.likesCount || p.likes_count || 0,
                                        imageUrl: p.displayUrl || p.display_url || p.images?.[0] || ""
                                    }));
                                    console.log(`✅ [APIFY] Fallback got ${posts.length} posts from 'details'`);
                                }
                            }
                        }
                    } catch (e) {
                        console.warn("⚠️ Fallback 'details' mode also failed");
                    }
                }

                // SMART RESTRICTION DETECTION
                // Distinguish between "No Data" vs "Age-Restricted" (has bio/photo but no posts)
                const hasValidProfile = profileInfo.biography !== "Bio no disponible"
                    || profileInfo.profilePic !== ""
                    || profileInfo.fullName !== handle;

                if (posts.length === 0 && !hasValidProfile) {
                    // TRUE GHOST: No data at all (Private or completely blocked)
                    console.warn(`⚠️ [APIFY] TRUE GHOST: No data for ${handle}`);
                    return {
                        socialMediaJson: {
                            username: handle,
                            fullName: handle,
                            biography: "Perfil Privado o Inaccesible",
                            followers: 0,
                            profilePic: "",
                            posts: [],
                            restrictionType: "PRIVATE" // Flag for frontend
                        },
                        identity: {
                            handle: `@${handle}`,
                            fullName: handle,
                            profilePic: ""
                        }
                    };
                }

                if (posts.length === 0 && hasValidProfile) {
                    // AGE-RESTRICTED: Has profile data but no posts (18+ content)
                    console.log(`📋 [APIFY] AGE-RESTRICTED: Profile data found but 0 posts for ${handle}`);
                    return {
                        socialMediaJson: {
                            username: profileInfo.username,
                            fullName: profileInfo.fullName,
                            biography: profileInfo.biography,
                            followers: profileInfo.followers || "Oculto",
                            profilePic: profileInfo.profilePic,
                            posts: [],
                            restrictionType: "AGE_RESTRICTED" // Flag for frontend
                        },
                        identity: {
                            handle: `@${profileInfo.username}`,
                            fullName: profileInfo.fullName,
                            profilePic: profileInfo.profilePic
                        }
                    };
                }

                return {
                    socialMediaJson: {
                        username: profileInfo.username,
                        fullName: profileInfo.fullName,
                        biography: profileInfo.biography,
                        followers: profileInfo.followers,
                        profilePic: profileInfo.profilePic,
                        posts: posts
                    },
                    identity: {
                        handle: `@${profileInfo.username}`,
                        fullName: profileInfo.fullName,
                        profilePic: profileInfo.profilePic
                    }
                };
            } catch (err) {
                console.error("❌ [APIFY] Critical Fail (Handled):", err.message);
                return {
                    socialMediaJson: {
                        username: handle,
                        fullName: handle,
                        biography: "Error de Conexión",
                        followers: 0,
                        profilePic: "",
                        posts: []
                    },
                    identity: {
                        handle: `@${handle}`,
                        fullName: handle,
                        profilePic: ""
                    }
                };
            }
        };

        // --- ANALYZE WEBSITE (CONTENT ONLY - screenshot is captured separately) ---
        const analyzeWebsite = async () => {
            console.log("🌐 websiteUrl received:", websiteUrl);
            if (!websiteUrl) {
                console.log("⚠️ No website URL provided, skipping");
                return null;
            }
            let targetUrl = websiteUrl;
            if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;

            try {
                const { data } = await axios.get(targetUrl, {
                    timeout: 10000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CoollaboraBot/1.0)' }
                });
                const $ = cheerio.load(data);
                const text = $('body').text().substring(0, 3000).replace(/\s+/g, ' ');
                console.log("🌐 Website content scraped, length:", text.length);
                return { websiteContent: text };
            } catch (err) {
                console.error("🌐 Website error:", err.message);
                return { websiteContent: "Error accessing website" };
            }
        };

        // --- EXECUTE PARALLEL ---
        const withTimeout = (promise, ms, name) => {
            const timeout = new Promise((resolve) =>
                setTimeout(() => { console.error(`${name} TIMED OUT`); resolve(null); }, ms)
            );
            return Promise.race([promise, timeout]);
        };

        // Prepare website URL for screenshot
        let websiteTargetUrl = null;
        if (websiteUrl) {
            websiteTargetUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
        }

        const [igResult, webResult, webScreenshot] = await Promise.allSettled([
            withTimeout(scrapeInstagram(), 60000, "Instagram Scraper"),
            withTimeout(analyzeWebsite(), 30000, "Website Analyzer"),
            withTimeout(websiteTargetUrl ? captureWebsiteScreenshot(websiteTargetUrl) : Promise.resolve(null), 10000, "Website Screenshot")
        ]);

        if (igResult.status === 'fulfilled' && igResult.value) {
            if (igResult.value?.socialMediaJson) socialMediaJson = igResult.value.socialMediaJson;
            if (igResult.value?.identity) identity = igResult.value.identity;
        }

        if (webResult.status === 'fulfilled' && webResult.value) {
            if (webResult.value?.websiteContent) websiteContent = webResult.value.websiteContent;
        }

        if (webScreenshot.status === 'fulfilled' && webScreenshot.value) {
            screenshotUrl = webScreenshot.value;
            console.log("✅ Website screenshot output ok");
        } else {
            console.log("⚠️ Website screenshot failed");
        }

        // --- FALLBACK HANDLING ---
        const hasInstagramData = socialMediaJson !== null;
        const hasWebsiteData = websiteContent !== "NO PROPORCIONADA" && websiteContent !== "Error accessing website";

        console.log(`📊 Data Status: Instagram=${hasInstagramData ? 'OK' : 'FAILED'}, Website=${hasWebsiteData ? 'OK' : 'FAILED'}`);

        if (!hasInstagramData) {
            const handleMatch = instagramUrl.match(/instagram\.com\/([^\/\?]+)/);
            const extractedHandle = handleMatch ? handleMatch[1] : 'unknown';

            socialMediaJson = {
                username: extractedHandle,
                fullName: extractedHandle,
                biography: "Perfil Privado / No Accesible",
                followers: 0,
                posts: []
            };

            identity = {
                handle: `@${extractedHandle}`,
                fullName: "Perfil Privado",
                profilePic: ""
            };

            console.log("⚠️ Using fallback Instagram data for handle:", extractedHandle);
        }

        // --- GEMINI PROMPT ---
        const parts = [
            { text: AUTHORITY_AUDITOR_PROMPT },
            ...(screenshotUrl ? [{ text: "\n" + VISION_AUDITOR_PROMPT }] : []),
            {
                text: `
            ---
            INPUT DATA:
            Social_Media_Data: ${JSON.stringify(socialMediaJson)}
            Website_Text_Data: ${websiteContent}
            ---
            `
            }
        ];

        if (screenshotUrl) {
            try {
                const imageResp = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
                parts.push({
                    inlineData: {
                        mimeType: "image/png",
                        data: Buffer.from(imageResp.data).toString('base64')
                    }
                });
            } catch (imgErr) { }
        }

        const jsonInstruction = `
        CRITICAL: You MUST append a JSON summary inside a code block \`\`\`json ... \`\`\` at the very end of your response.
        The JSON must strictly follow this schema:
        {
            "brandIntegrity": {
                "score": 5, // Integer 1-10
                "status": "EN RIESGO", // "OPTIMIZADO" | "EN RIESGO" | "CRÍTICO"
                "verdict": "Short explanation..."
            },
            "visualInfrastructure": {
                "score": 4, // Integer 1-10
                "status": "DESALINEADO", // "ALINEADO" | "DESALINEADO" | "CRÍTICO"
                "verdict": "Short explanation..."
            },
            "globalScore": 6 // Integer 1-10
        }
        `;

        parts.push({ text: `\n[INSTRUCTION] Generate the Main Authority Report in Markdown. \nTHEN, ${jsonInstruction}` });

        const result = await model.generateContent(parts);
        const responseText = result.response.text();

        // --- PARSE JSON ---
        let visionAnalysis = null;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch?.[1]) {
            try { visionAnalysis = JSON.parse(jsonMatch[1]); } catch (e) { }
        }

        let reportText = responseText.replace(/```json[\s\S]*?```/g, '').trim();

        const finalResult = {
            report: reportText,
            identity: identity,
            visionAnalysis: visionAnalysis,
            dataUsed: {
                socialMediaJson: socialMediaJson,
                instagram: socialMediaJson ? "scraped" : "fallback",
                website: websiteContent !== "NO PROPORCIONADA" ? "scraped" : "none"
            },
            visualEvidence: {
                instagramScreenshot: null, // No capturamos screenshot de Instagram (usa datos scraped)
                websiteScreenshot: screenshotUrl
            }
        };

        // DETERMINE AUDIT STATUS BASED ON RESTRICTION
        const restrictionType = socialMediaJson?.restrictionType || null;
        const auditStatus = (restrictionType === 'AGE_RESTRICTED' || restrictionType === 'PRIVATE')
            ? 'pending_review'
            : 'complete';

        console.log(`📊 [AUDIT STATUS] ${auditStatus} (Restriction: ${restrictionType || 'NONE'})`);

        // CACHE WITH ENHANCED SCHEMA
        const auditDoc = await admin.firestore().collection('audits').add({
            instagramUrl,
            websiteUrl: websiteUrl || null,
            createdAt: new Date(),
            auditStatus,              // 'complete' | 'pending_review'
            restrictionType,          // 'AGE_RESTRICTED' | 'PRIVATE' | null
            manualAnalysis: null,     // Field for admin manual review (Markdown)
            doctorEmail: null,        // To be captured in frontend form
            completedAt: auditStatus === 'complete' ? new Date() : null,
            ...finalResult
        });

        // Add audit ID to the result for frontend reference
        finalResult.auditId = auditDoc.id;
        finalResult.auditStatus = auditStatus;
        finalResult.restrictionType = restrictionType;

        // TRIGGER: Notify Admin when pending_review
        if (auditStatus === 'pending_review') {
            const handle = instagramUrl.split('instagram.com/')[1]?.split('/')[0]?.split('?')[0] || 'unknown';
            console.log(`📧 [ADMIN ALERT] New pending review: @${handle} (ID: ${auditDoc.id})`);
            console.log(`   Restriction Type: ${restrictionType}`);
            console.log(`   Admin URL: /admin (audit ID: ${auditDoc.id})`);

            // TODO: Implement actual email notification with SendGrid/Nodemailer
            // await notifyAdminReview({
            //     auditId: auditDoc.id,
            //     instagramUrl,
            //     restrictionType,
            //     handle
            // });
        }

        return finalResult;

    } catch (error) {
        logger.error("Audit Failed:", error);
        return { error: 'SYSTEM_ERROR', message: error.message };
    }
});

// ============================================
// ANALYZE SCREENSHOT WITH GEMINI VISION
// ============================================
const { VISION_AUDITOR_PROMPT: SCREENSHOT_VISION_PROMPT, PALABRAS_ROJAS } = require('./src/prompts/authority_dictionary.js');

exports.analyzeScreenshotWithVision = onCall({ timeoutSeconds: 60, memory: "512MiB" }, async (request) => {
    const { imageUrl, auditId } = request.data;

    if (!imageUrl) {
        throw new HttpsError('invalid-argument', 'imageUrl is required');
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Fetch image as base64
        const imageResp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageResp.data).toString('base64');
        const mimeType = imageUrl.includes('.png') ? 'image/png' : 'image/jpeg';

        const prompt = `
Actúa como un **Auditor de Estatus para Cirugía de Élite**. 
Analiza la imagen adjunta buscando evidencias de **Incongruencia Clínica**.

CATEGORÍAS DE HALLAZGO A DETECTAR:
- Incongruencia Semántica: instrumental quirúrgico en entornos no estériles
- Trauma Visual Crudo: sangre/incisiones sin filtros profesionales
- Banalización de Estatus: poses de influencer, sexualización
- Indigencia Lumínica: mala iluminación, ruido digital
- Desorden Arquitectónico: fondos desordenados, cables, entornos domésticos

**Restricción:** No uses adjetivos subjetivos como 'feo' o 'malo'. 
Usa terminología de **Arbitraje de Atención** y **Evidencia de Estatus**.

Responde SOLO en JSON válido:
{
    "hallazgo_tipo": "incongruencia_semantica | trauma_visual | banalizacion | indigencia_luminica | desorden | integridad",
    "nivel_erosion": 5,
    "clasificacion": "Erosión Crítica | Vulnerabilidad Moderada | Integridad de Autoridad",
    "veredicto": "Descripción técnica del hallazgo...",
    "elementos_detectados": ["elemento1", "elemento2"]
}
`;

        const result = await model.generateContent([
            { text: prompt },
            { inlineData: { mimeType, data: base64Image } }
        ]);

        const responseText = result.response.text();

        // Parse JSON from response
        let analysis = null;
        try {
            // Try to extract JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            logger.warn('Failed to parse vision analysis JSON:', e);
            analysis = {
                hallazgo_tipo: 'error',
                nivel_erosion: 5,
                clasificacion: 'Análisis Pendiente',
                veredicto: responseText.substring(0, 200),
                elementos_detectados: []
            };
        }

        console.log(`📷 [VISION] Analyzed screenshot for audit ${auditId}: ${analysis.clasificacion}`);
        return analysis;

    } catch (error) {
        logger.error("Vision analysis failed:", error);
        throw new HttpsError('internal', error.message);
    }
});

// ============================================
// ANALYZE CAPTIONS (Semiotics)
// ============================================
exports.analyzeCaptionsSemiotics = onCall({ timeoutSeconds: 30 }, async (request) => {
    const { captions } = request.data;

    if (!captions || captions.trim().length < 10) {
        throw new HttpsError('invalid-argument', 'captions text is required (min 10 chars)');
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
Actúa como un **Auditor de Oratoria Clínica de Élite**.
Analiza el siguiente texto de posts/captions de Instagram de un médico cirujano.

PALABRAS ROJAS A DETECTAR (señalan pérdida de estatus):
- Comerciales: promoción, oferta, descuento, barato, aprovecha
- Banalización: diminutivos (cirugíita, cosita), emojis verbales (súper, wow)
- Subordinación: ayúdame, sígueme, dale like, comenta

TEXTO A ANALIZAR:
"""
${captions}
"""

Responde SOLO en JSON válido:
{
    "densidad_autoridad": 6,
    "palabras_rojas_detectadas": ["palabra1", "palabra2"],
    "clasificacion": "Oratoria de Élite | Erosión Moderada | Subordinación Activa",
    "veredicto": "El especialista presenta...",
    "sugerencias_reingenieria": [
        {"original": "frase original", "sugerido": "frase de alto estatus"}
    ]
}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse JSON from response
        let analysis = null;
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            logger.warn('Failed to parse captions analysis JSON:', e);
            analysis = {
                densidad_autoridad: 5,
                palabras_rojas_detectadas: [],
                clasificacion: 'Análisis Pendiente',
                veredicto: responseText.substring(0, 200),
                sugerencias_reingenieria: []
            };
        }

        console.log(`📝 [CAPTIONS] Analyzed: ${analysis.clasificacion}`);
        return analysis;

    } catch (error) {
        logger.error("Captions analysis failed:", error);
        throw new HttpsError('internal', error.message);
    }
});
