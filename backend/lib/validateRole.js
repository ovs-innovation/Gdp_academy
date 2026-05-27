const Role = require("../models/roleModel.js");

const resolveRoleKey = async (roleKey) => {
  if (!roleKey) return "student";
  const key = roleKey.toLowerCase();
  const dbRole = await Role.findOne({ key });
  return dbRole ? dbRole.key : "student";
};

module.exports = { resolveRoleKey };
