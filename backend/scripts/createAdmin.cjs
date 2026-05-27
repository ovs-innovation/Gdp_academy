require("dotenv").config();
const connectDB = require("../config/db.js");
const User = require("../models/userModel.js");
const { ensureDefaultRoles } = require("../controllers/roleController.js");

const ADMIN_EMAIL = "admin@gdpstudio.com";
const ADMIN_PASSWORD = "adminpassword";
const ADMIN_NAME = "GDP Admin";

async function createAdmin() {
  await connectDB(process.env.MONGO_URI);
  await ensureDefaultRoles();

  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (admin) {
    admin.name = ADMIN_NAME;
    admin.role = "admin";
    admin.status = "active";
    admin.password = ADMIN_PASSWORD;
    await admin.save();
    console.log(`Admin updated: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      status: "active",
    });
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
