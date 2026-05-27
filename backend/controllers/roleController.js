const Role = require("../models/roleModel.js");
const { permissions, rolePermissions } = require("../lib/roles.js");

const toDto = (role) => ({
  id: role._id.toString(),
  name: role.name,
  key: role.key,
  permissions: role.permissions || [],
  createdAt: role.createdAt,
});

const sanitizePermissions = (perms = []) =>
  perms.filter((p) => permissions.includes(p));

const listRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json({ roles: roles.map(toDto), permissions });
  } catch (err) {
    next(err);
  }
};

const createRole = async (req, res, next) => {
  try {
    const { name, key, permissions: perms = [] } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const roleKey = (key || name).toLowerCase().replace(/\s+/g, "_");

    const exists = await Role.findOne({ key: roleKey });
    if (exists) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      name,
      key: roleKey,
      permissions: sanitizePermissions(perms),
    });

    res.status(201).json({ role: toDto(role) });
  } catch (err) {
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, permissions: perms } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (name) role.name = name;
    if (Array.isArray(perms)) {
      role.permissions = sanitizePermissions(perms);
    }

    await role.save();
    res.json({ role: toDto(role) });
  } catch (err) {
    next(err);
  }
};

const ensureDefaultRoles = async () => {
  const defaults = Object.keys(rolePermissions);
  for (const key of defaults) {
    const exists = await Role.findOne({ key });
    if (!exists) {
      await Role.create({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        key,
        permissions: rolePermissions[key],
      });
    } else {
      // Merge only: add missing default permissions, never wipe admin customizations
      const defaults = sanitizePermissions(rolePermissions[key] || []);
      const current = exists.permissions || [];
      const merged = [...new Set([...current, ...defaults])];
      if (merged.length !== current.length) {
        exists.permissions = merged;
        await exists.save();
      }
    }
  }
};

module.exports = {
  listRoles,
  createRole,
  updateRole,
  ensureDefaultRoles,
};
