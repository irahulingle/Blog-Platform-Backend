import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Missing or malformed Authorization header");
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    if (!decoded.userId) {
      console.log("❌ JWT does not contain userId");
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
