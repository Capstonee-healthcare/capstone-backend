const { admin } = require("../config/firebaseAdmin");

/**
 * Middleware to verify Firebase JWT tokens
 * Extracts token from Authorization header and verifies it
 */
const verifyToken = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and has Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided. Please include Authorization header with Bearer token.",
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid token format.",
      });
    }

    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user info to request object for use in controllers
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      // Add any other claims you need
    };

    // Continue to the next middleware/controller
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);

    // Handle specific Firebase Auth errors
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "TokenExpired",
        message: "Token has expired. Please refresh your token.",
      });
    }

    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        error: "InvalidToken",
        message: "Invalid token format.",
      });
    }

    // Generic error response
    return res.status(401).json({
      error: "Unauthorized",
      message: "Token verification failed.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Optional: Middleware to verify token but allow request to continue even if no token
 * Useful for routes that work for both authenticated and non-authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    console.warn("Optional auth failed, continuing without user:", error.message);
    next();
  }
};

module.exports = { verifyToken, optionalAuth };

