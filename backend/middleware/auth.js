const jwt = require("jsonwebtoken");

// Route ekak protect karanna oni nam methodeka use karanna
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token na. Login wela ida." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // { id, username }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token eka invalid nattam expire wela." });
  }
}

module.exports = verifyToken;