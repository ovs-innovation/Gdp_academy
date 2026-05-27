const User = require("../models/userModel.js");

const ADMIN_EMAIL = "admin@gdpstudio.com";
const LEGACY_ADMIN_EMAIL = "admin@gdpacademy.com";
const ADMIN_PASSWORD = "adminpassword";
const ADMIN_NAME = "GDP Admin";

/**
 * Ensures a default admin exists. Never deletes users or CMS data.
 * Only creates or migrates legacy email — no automatic deletions.
 */
async function ensureDefaultAdmin() {
  let admin = await User.findOne({ email: ADMIN_EMAIL });
  const legacy = await User.findOne({ email: LEGACY_ADMIN_EMAIL });

  if (!admin && legacy) {
    legacy.email = ADMIN_EMAIL;
    legacy.name = ADMIN_NAME;
    legacy.role = "admin";
    legacy.status = "active";
    legacy.password = ADMIN_PASSWORD;
    await legacy.save();
    console.log(
      `Default admin migrated: ${LEGACY_ADMIN_EMAIL} -> ${ADMIN_EMAIL}`,
    );
    admin = legacy;
  }

  if (!admin) {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      status: "active",
    });
    console.log(`Default admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    return;
  }

  let changed = false;
  if (admin.role !== "admin" && admin.role !== "super_admin") {
    admin.role = "admin";
    changed = true;
  }
  if (admin.status !== "active") {
    admin.status = "active";
    changed = true;
  }
  if (changed) await admin.save();
}

module.exports = { ensureDefaultAdmin };
