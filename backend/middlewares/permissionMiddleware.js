const Role = require("../models/roleModel.js");
const { rolePermissions } = require("../lib/roles.js");

const requirePermission = (permission) => async (req, res, next) => {
  const roleKey = req.user?.role;

  if (!roleKey) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // recovery mode for admin
  if (roleKey === "admin" || roleKey === "super_admin") {
    return next();
  }

  const role = await Role.findOne({ key: roleKey });

  const dbPerms = role?.permissions || [];
  const defaultPerms = rolePermissions[roleKey] || [];

  const perms = dbPerms.length > 0 ? dbPerms : defaultPerms;

  if (!perms.includes(permission)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    const roleKey = req.user?.role;

    // recovery mode for admin
    if (roleKey === "admin" || roleKey === "super_admin") {
      return next();
    }

    if (
      !roleKey ||
      (!allowedRoles.includes(roleKey) &&
        !(roleKey === "super_admin" && allowedRoles.includes("admin")))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };

module.exports = {
  requirePermission,
  authorize,
};
