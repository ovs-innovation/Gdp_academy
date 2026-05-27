const isAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== "admin" && role !== "super_admin") {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({
      error: "Access denied. Student privileges required.",
    });
  }
  next();
};

module.exports = {
  isAdmin,
  isStudent,
};
