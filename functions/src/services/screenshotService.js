// Screenshot Service using ScreenshotAPI.net
// Simple, fast, predictable - just builds URL, frontend loads directly

/**
 * Build website screenshot URL using ScreenshotAPI.net
 * @param {string} url - The URL to capture
 * @returns {Promise<string|null>} - The screenshot URL or null if failed
 */
const captureWebsiteScreenshot = async (url) => {
    try {
        const apiKey = process.env.SCREENSHOTAPI_KEY;
        if (!apiKey) {
            console.warn("⚠️ SCREENSHOTAPI_KEY missing. Skipping website screenshot.");
            return null;
        }

        if (!url || url === 'NO PROPORCIONADA') {
            console.warn("⚠️ No website URL provided");
            return null;
        }

        console.log("📸 Building screenshot URL for:", url);

        // Build ScreenshotAPI.net URL - frontend will load this directly
        // No need to make HTTP request here - that just wastes time
        const screenshotUrl = `https://shot.screenshotapi.net/v3/screenshot?` + new URLSearchParams({
            token: apiKey,
            url: url,
            width: 800,
            height: 600,
            full_page: 'false',
            fresh: 'false', // Use cache if available
            output: 'image',
            file_type: 'png',
            wait_for_event: 'load',
            delay: 1000, // 1 second delay for content to load
        }).toString();

        console.log("✅ Screenshot URL ready:", screenshotUrl.substring(0, 80) + "...");

        return screenshotUrl;

    } catch (error) {
        console.error("❌ Screenshot URL build failed:", error.message);
        return null;
    }
};

/**
 * Instagram screenshot - not available (requires login)
 * Keeping for compatibility but always returns null
 */
const captureInstagramProfile = async (handle) => {
    console.log("⚠️ Instagram screenshot not available (login required)");
    return null;
};

module.exports = { captureWebsiteScreenshot, captureInstagramProfile };
