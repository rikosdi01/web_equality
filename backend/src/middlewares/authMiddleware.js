const admin = require("../config/firebase");

async function checkAccessToken(req, res, next) {
    const accessToken = req.headers.authorization?.split("Bearer ")[1];

    console.log("Access Token diterima:", accessToken); // Log token

    if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(accessToken);
        req.user = decodedToken;
        next(); // Lanjut ke route berikutnya
    } catch (error) {
        res.status(403).json({ error: "Invalid access token", details: error.message });
    }
}


module.exports = checkAccessToken;