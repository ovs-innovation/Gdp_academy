const jwt = require("jsonwebtoken");

/** Attach req.user when a valid Bearer token is present; never reject. */
const optionalVerifyToken = (req, _res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded?.id) {
      req.user = { id: decoded.id, role: decoded.role };
    }
    next();
  });
};

module.exports = { optionalVerifyToken };
