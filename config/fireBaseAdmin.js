// config/firebaseAdmin.js
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

const path = require("path");
const serviceAccountPath = path.resolve(
	process.env.GOOGLE_APPLICATION_CREDENTIALS
);
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
