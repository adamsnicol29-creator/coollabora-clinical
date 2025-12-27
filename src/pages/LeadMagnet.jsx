import { useState, useEffect } from 'react';
import {
    ShieldCheck, Activity, ArrowRight, Search, Lock, Loader2,
    FileWarning, TrendingDown, Eye, CheckCircle, AlertTriangle, Scan, Globe, Database, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import ReactMarkdown from 'react-markdown';

// Refactored Components
import CountdownTimer from '../components/lead-magnet/CountdownTimer';
import ProgressModal from '../components/lead-magnet/ProgressModal';
import RiskTrafficLight from '../components/lead-magnet/RiskTrafficLight';
import AuditCard from '../components/lead-magnet/AuditCard';
import InfoModal from '../components/lead-magnet/InfoModal';
import ManualReviewPlaceholder from '../components/lead-magnet/ManualReviewPlaceholder';
import ScraperFailureModal from '../components/lead-magnet/ScraperFailureModal';
import LeadCaptureModal from '../components/lead-magnet/LeadCaptureModal';
import ClinicalReportView from '../components/lead-magnet/ClinicalReportView';



export default function LeadMagnet() {
    const [instagramUrl, setInstagramUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressStatus, setProgressStatus] = useState('');
    const [report, setReport] = useState(null);

    // VIEW STATE: 'input', 'teaser', 'report'
    const [viewState, setViewState] = useState('input');
    const [showCaptureModal, setShowCaptureModal] = useState(false);

    // UNLOCKING SEQUENCE STATE
    const [unlocking, setUnlocking] = useState(false);
    const [unlockProgress, setUnlockProgress] = useState(0);
    const [unlockStatus, setUnlockStatus] = useState('');

    // INFO MODAL STATE
    const [infoModal, setInfoModal] = useState(null);
    const [showScraperFailure, setShowScraperFailure] = useState(false);

    const startUnlockSequence = () => {
        setUnlocking(true);
        setUnlockProgress(0);
        setUnlockStatus('Verificando credenciales de especialista...');

        // Step 1: 0-33% (1s)
        setTimeout(() => {
            setUnlockProgress(35);
            setUnlockStatus('Compilando datos de brecha competitiva...');
        }, 1000);

        // Step 2: 35-66% (1s)
        setTimeout(() => {
            setUnlockProgress(70);
            setUnlockStatus('Generando protocolo de reingeniería personalizado...');
        }, 2000);

        // Step 3: Finish (1s)
        setTimeout(() => {
            setUnlockProgress(100);
            setUnlocking(false);
            setShowCaptureModal(true);
        }, 3000);
    };

    // SIMULATED PROGRESS FOR UX (CLINICAL NARRATIVE)
    useEffect(() => {
        if (!analyzing) return;

        setProgress(0);
        setProgressStatus('🔐 Iniciando protocolos de acceso seguro...');

        // Clinical progress messages that rotate
        const messages = [
            '🔐 Iniciando protocolos de acceso seguro...',
            '📡 Conectando con servidores de Meta...',
            '👤 Identificando perfil profesional...',
            '📊 Extrayendo métricas de engagement...',
            '🖼️ Analizando coherencia visual del feed...',
            '📝 Clasificando tipo de contenido publicado...',
            '🔍 Detectando patrones de autoridad clínica...',
            '🌐 Escaneando infraestructura web pública...',
            '🎨 Evaluando identidad de marca digital...',
            '📈 Calculando índice de obsolescencia estética...',
            '🧠 Aplicando modelo de IA Gemini Pro...',
            '📋 Compilando hallazgos preliminares...',
            '✍️ Redactando veredicto del expediente...',
            '🔒 Verificando integridad del análisis...',
            '📁 Generando expediente de autoridad...',
        ];

        let messageIndex = 0;

        const interval = setInterval(() => {
            setProgress(prev => {
                // Cap at 92% until real finish
                if (prev >= 90) {
                    setProgressStatus('⏳ Finalizando expediente... casi listo');
                    return 92;
                }

                // Faster initial progress, slower towards end
                const speed = prev < 50 ? 2.5 : prev < 75 ? 1.5 : 0.8;
                const increment = Math.random() * speed;
                const next = Math.min(prev + increment, 92);

                // Rotate messages every ~5% progress
                const expectedIndex = Math.floor(next / 6);
                if (expectedIndex > messageIndex && expectedIndex < messages.length) {
                    messageIndex = expectedIndex;
                    setProgressStatus(messages[messageIndex]);
                }

                return next;
            });
        }, 400); // Faster updates (400ms) for smoother progress feel

        return () => clearInterval(interval);
    }, [analyzing]);

    const runAudit = async (e) => {
        e.preventDefault();
        if (!instagramUrl) return;
        setAnalyzing(true);
        setReport(null);

        try {
            const functions = getFunctions();
            if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
                try { connectFunctionsEmulator(functions, "127.0.0.1", 5001); } catch (e) { }
            }

            const performAudit = httpsCallable(functions, 'performAuthorityAudit', { timeout: 540000 });

            // Allow time for progress animation to feel real (at least 3s)
            const minTime = new Promise(resolve => setTimeout(resolve, 3000));

            const [result] = await Promise.all([
                performAudit({ instagramUrl, websiteUrl }),
                minTime
            ]);

            const data = /** @type {any} */ (result?.data || {});

            // SOFT ERROR HANDLING (Universal Fail-Safe)
            if (data.error) {
                console.error("Soft Error Received:", data.error, data.message);
                setAnalyzing(false);
                setShowScraperFailure(true); // Treat all backend errors as "Protocol Interruption" for UX
                return;
            }

            const report = data.report || { rawMarkdown: "Error: No report content" };
            const identity = data.identity || { handle: "Usuario", fullName: "Profesional" };
            const visionAnalysis = data.visionAnalysis || null;

            setProgress(100);

            // PREPARE REPORT DATA
            const finalReport = {
                rawMarkdown: report,
                identity: identity,
                visionAnalysis: visionAnalysis,
                visualEvidence: data.visualEvidence || null, // Evidencia Observacional screenshots
                auditId: data.auditId || "CKL-" + Math.floor(Math.random() * 90000 + 10000),
                auditStatus: data.auditStatus || 'complete', // 'complete' | 'pending_review'
                restrictionType: data.restrictionType || null, // 'AGE_RESTRICTED' | 'PRIVATE' | null
                dataUsed: data.dataUsed || null, // For detecting posts/restrictions
                // Safe score calculation - uses new nested structure
                authorityScore: (() => {
                    if (!visionAnalysis) return null; // Will show "EN EVALUACIÓN"
                    const brand = visionAnalysis.brandIntegrity?.score;
                    const aesthetic = visionAnalysis.visualInfrastructure?.score;
                    if (typeof brand !== 'number' || typeof aesthetic !== 'number') return null;
                    const calculated = Math.round((brand + aesthetic) / 2 * 10) / 10;
                    return isNaN(calculated) ? null : calculated;
                })(),
            };

            // Transition to TEASER
            setTimeout(() => {
                setReport(finalReport);
                setAnalyzing(false);
                setViewState('teaser'); // SHOW TEASER FIRST
            }, 800);

        } catch (error) {
            console.error("Audit Error:", error);
            setAnalyzing(false);

            // ERROR HANDLING LOGIC (Daily limit removed)

            if (error.code === 'data-loss' || error.message.includes('DATA_INTEGRITY_FAIL')) {
                setShowScraperFailure(true);
                return;
            }

            alert("Error del Sistema: " + error.message);
            setViewState('input');
        }
    };

    const handleUnlockReport = (leadData) => {
        // Here we would save leadData to Firebase
        console.log("Lead Captured:", leadData);
        setShowCaptureModal(false);
        setViewState('report');
    };

    // NOTE: Waitlist view removed. Unlimited audits allowed.

    // --- TEASER VIEW RENDERER ---
    if (viewState === 'teaser' && report) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
                {/* MODAL */}
                <LeadCaptureModal isOpen={showCaptureModal} onClose={() => setShowCaptureModal(false)} onUnlock={handleUnlockReport} />

                {/* BACKGROUND TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <div className="max-w-4xl w-full text-center relative z-10">
                    <div className="mb-8 inline-block animate-pulse">
                        <div className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-200">
                            ⚠ Anomalías Críticas Detectadas
                        </div>
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-surgical-gray mb-8">
                        Lectura Preliminar Lista
                    </h1>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-2xl mx-auto mb-12 transform hover:scale-[1.01] transition-transform">
                        {/* System Note - Advisor Recommendation */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-center">
                            <p className="text-xs text-amber-700 font-mono">
                                ⚠ ESTADO DEL ANÁLISIS: Lectura preliminar automatizada. Interpretación completa requiere custodia activa.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-6 mb-8">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Score Global</p>
                                {report.authorityScore !== null ? (
                                    <p className={`text-6xl font-serif font-bold ${report.authorityScore <= 4 ? 'text-red-600' : 'text-orange-500'}`}>
                                        {Math.ceil(report.authorityScore)}<span className="text-2xl text-slate-300">/10</span>
                                    </p>
                                ) : (
                                    <p className="text-2xl font-serif font-bold text-amber-600">EN EVALUACIÓN</p>
                                )}
                                <p className="text-xs text-slate-500 mt-2 italic">Estado del expediente: Custodia no activa</p>
                            </div>
                        </div>

                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            Hemos completado la auditoría dual de su presencia digital ({report.identity?.handle || '@perfil'}).
                            Detectamos <strong className="text-red-600">indicadores de erosión de autoridad</strong> que podrían estar impactando su tasa de conversión de pacientes High-Ticket.
                        </p>

                        <button
                            onClick={startUnlockSequence}
                            className="w-full py-5 bg-surgical-gray hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                        >
                            <Eye size={18} /> Ver Expediente Clínico Completo
                        </button>

                        {/* DEV BYPASS - Visible in teaser view */}
                        {(location.hostname === 'localhost' || location.hostname === '127.0.0.1') && (
                            <button
                                onClick={() => setViewState('report')}
                                className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-mono rounded-lg border-2 border-dashed border-red-400 transition-colors">
                                🔧 DEV BYPASS: Ir directo al Reporte Completo
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- REPORT VIEW (FULL - PRELIMINAR) ---
    if (viewState === 'report' && report) {
        return (
            <ClinicalReportView
                report={report}
                onAction={() => window.open('https://buy.stripe.com/ExamplePaymentLink', '_blank')} // TODO: Replace with real link
            />
        );
    }

    // LANDING VIEW (ELITE TERMINAL)
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex flex-col relative overflow-hidden font-sans">
            {/* TEXTURE OVERLAY */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* HEADER STATUS DISCRETO */}
            <div className="bg-slate-100/50 text-slate-500 py-2 px-4 text-center sticky top-0 z-50 backdrop-blur-sm border-b border-slate-200">
                <p className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Activity size={12} className="text-cobalt-blue" />
                    Sistema de Auditoría: Activo | Versión Clínica 2.4
                </p>
            </div>

            {/* PROGRESS OVERLAY (Shared for Initial Audit & Unlocking) */}
            <AnimatePresence>
                {(analyzing || unlocking) && <ProgressModal progress={unlocking ? unlockProgress : progress} status={unlocking ? unlockStatus : progressStatus} />}
            </AnimatePresence>

            <ScraperFailureModal isOpen={showScraperFailure} onClose={() => setShowScraperFailure(false)} onRetry={() => runAudit({ preventDefault: () => { } })} />

            {/* NAV */}
            <nav className="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="font-serif font-bold text-xl text-surgical-gray tracking-tight">COOLLABORA <span className="text-cobalt-blue">CLINICAL</span></div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest border border-slate-300 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm">Accesible solo por invitación</div>
            </nav>

            {/* HERO */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

                <div className="max-w-4xl w-full text-center mb-12">
                    <p className="text-xs font-bold tracking-[0.2em] text-cobalt-blue uppercase mb-6 bg-blue-50 inline-block px-4 py-2 rounded-full border border-blue-100">
                        TECNOLOGÍA DE ECONOMÍA PREDICTIVA
                    </p>

                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-surgical-gray mb-8 leading-[1.1]">
                        La mayoría de los pacientes decide <br />
                        <span className="text-slate-400 italic font-serif">antes de llegar a la consulta.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 font-sans font-light max-w-3xl mx-auto leading-relaxed px-4">
                        Nuestros sistemas se construyeron tras más de 15 años en el sector, 5,000 cierres 1:1 y +$2M USD en ventas reales, no desde el marketing teórico.
                        <br /><span className="font-medium text-slate-800">Ejecute una evaluación de su autoridad digital</span> y detecte fugas de valor en 90 segundos.
                    </p>
                </div>

                {/* INTELLIGENCE TERMINAL FORM */}
                <div className="w-full max-w-2xl backdrop-blur-xl bg-white/60 border border-white/80 p-1 rounded-2xl shadow-2xl shadow-slate-300/50 relative">

                    {/* Social Proof Badge */}
                    <div className="absolute -top-5 left-0 right-0 flex justify-center">
                        <div className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-2 border border-slate-700">
                            <ShieldCheck size={12} className="text-emerald-400" /> ALGORITMO BASADO EN +5,000 CIERRES REALES 1:1
                        </div>
                    </div>

                    <div className="bg-white/90 p-8 md:p-10 rounded-xl border border-white/60">
                        <form onSubmit={runAudit} className="space-y-6 mt-2">

                            {/* DUAL TERMINAL INPUTS */}
                            <div className="space-y-4">
                                {/* IG INPUT */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search size={20} className="text-slate-400 group-focus-within:text-cobalt-blue transition-colors" />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="URL Perfil Instagram (La Fachada)"
                                        value={instagramUrl}
                                        onChange={e => setInstagramUrl(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-5 rounded-lg text-surgical-gray placeholder-slate-400 focus:outline-none focus:border-cobalt-blue focus:ring-1 focus:ring-cobalt-blue transition-all font-mono text-sm shadow-sm hover:bg-white"
                                    />
                                </div>

                                {/* WEB INPUT */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Globe size={20} className="text-slate-400 group-focus-within:text-cobalt-blue transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="URL Sitio Web (La Infraestructura)"
                                        value={websiteUrl}
                                        onChange={e => setWebsiteUrl(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-5 rounded-lg text-surgical-gray placeholder-slate-400 focus:outline-none focus:border-cobalt-blue focus:ring-1 focus:ring-cobalt-blue transition-all font-mono text-sm shadow-sm hover:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-5 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 mt-4 group"
                            >
                                <Database size={16} className="text-blue-200 group-hover:text-white transition-colors" /> EJECUTAR ANÁLISIS PREDICTIVO
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed max-w-sm mx-auto">
                                Coollabora no evalúa criterios médicos ni clínicos. Analiza exclusivamente la percepción, confianza y decisión del paciente antes de la consulta.
                            </p>

                        </form>
                    </div>
                </div>

                {/* TRUST BADGES - ELEGANT */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
                    <div className="flex items-center gap-3 text-xs font-bold text-surgical-gray uppercase tracking-wider">
                        <Lock size={16} className="text-cobalt-blue" /> Protocolo de Seguridad Clínica
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-surgical-gray uppercase tracking-wider">
                        <Activity size={16} className="text-cobalt-blue" /> Análisis Basado en Neuro-Marketing
                    </div>
                </div>

            </main>
        </div>
    );
}
