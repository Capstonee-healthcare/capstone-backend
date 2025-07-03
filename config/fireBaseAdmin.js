// config/firebaseAdmin.js
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const serviceAccountPath = path.resolve(
	process.env.GOOGLE_APPLICATION_CREDENTIALS
);
const serviceAccount = require(serviceAccountPath);

// ✅ Prevent re-initializing if already initialized
if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

const db = admin.firestore();

module.exports = { admin, db };
