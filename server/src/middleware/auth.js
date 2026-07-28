const jwt = require("jsonwebtoken");

function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Admin login is required.",
    });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Your admin session expired. Please log in again.",
    });
  }
}

module.exports = requireAdminAuth;
