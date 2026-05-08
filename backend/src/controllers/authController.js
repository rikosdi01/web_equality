const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const db = admin.firestore();
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; // Pastikan sudah diset

// Gunakan JWT untuk membuat accessToken
const createAccessToken = (uid) => {
  return jwt.sign({ uid }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// ✅ Hilangkan pembuatan custom token
exports.login = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Log token yang diterima untuk debug
    console.log("ID Token yang diterima:", idToken);

    // Verifikasi ID token yang diterima
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Generate refresh token
    const refreshToken = jwt.sign({ uid }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Simpan refreshToken ke Firestore
    await db.collection("refreshTokens").doc(uid).set({ refreshToken });

    // Simpan refreshToken di cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/"
    });

    // Kirim kembali idToken ke frontend sebagai accessToken
    res.json({ accessToken: idToken });
  } catch (error) {
    res.status(401).json({ message: "Login gagal", error });
  }
};



// ✅ Refresh Token - Buat accessToken baru
exports.refreshToken = async (req, res) => {
  console.log("Cookies yang diterima:", req.cookies); // 🔍 Cek apakah cookie diterima
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
      return res.status(403).json({ message: "Tidak ada refresh token" });
  }

  try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const uid = decoded.uid;

      const doc = await db.collection("refreshTokens").doc(uid).get();
      if (!doc.exists || doc.data().refreshToken !== refreshToken) {
          return res.status(403).json({ message: "Refresh token tidak valid atau tidak cocok" });
      }

      // Generate new access token
      const accessToken = createAccessToken(uid); // Gunakan fungsi baru ini
      res.json({ accessToken });
  } catch (error) {
      console.error("Error saat verifikasi refresh token:", error);
      res.status(403).json({ message: "Refresh token tidak valid", error });
  }
};


// ✅ Logout - Hapus refreshToken dari database & cookie
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).json({ message: "Tidak ada refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const uid = decoded.uid;

    // Hapus refresh token dari database
    await db.collection("refreshTokens").doc(uid).delete();

    // Hapus cookie refresh token
    res.clearCookie("refreshToken", { path: "/" });

    res.json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Gagal logout", error });
  }
};

// Set Role untuk User
exports.setUserRole = async (req, res) => {
  const { uid, role } = req.body; // Ambil UID & role dari request

  try {
    await admin.auth().setCustomUserClaims(uid, { role: role });
    res.json({ message: `Role "${role}" berhasil diberikan ke user ${uid}` });
  } catch (error) {
    console.error("Gagal mengatur role:", error); // Log error ke console
    res.status(500).json({ error: "Gagal mengatur role", details: error.message });
  }
};

// Ambil Role User berdasarkan UID
exports.getUserRole = async (req, res) => {
  const { uid } = req.params; // Ambil UID dari parameter URL

  try {
    const user = await admin.auth().getUser(uid);
    res.json({ uid: user.uid, role: user.customClaims || {} }); // Kirim role sebagai response
  } catch (error) {
    console.error("Gagal mengambil role:", error);
    res.status(500).json({ error: "Gagal mengambil role", details: error.message });
  }
};
