require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db.js");
const CMS = require("../models/cmsModel.js");
const {
  DEFAULT_CMS_SERVICES,
  LEGACY_SERVICE_KEYS,
} = require("./data/defaultServices.js");

const upsertServices = async ({ deactivateLegacy = true } = {}) => {
  console.log("Seeding CMS services (section: services)...");

  for (const doc of DEFAULT_CMS_SERVICES) {
    const existing = await CMS.findOne({ key: doc.key });
    if (existing) {
      existing.section = doc.section;
      existing.title = doc.title;
      existing.description = doc.description;
      existing.content = doc.content;
      existing.images = doc.images;
      existing.metadata = doc.metadata;
      existing.isActive = doc.isActive;
      existing.publishedAt = new Date();
      await existing.save();
      console.log(`  ↻ Updated: ${doc.key}`);
    } else {
      await CMS.create({
        ...doc,
        publishedAt: new Date(),
      });
      console.log(`  ✓ Created: ${doc.key}`);
    }
  }

  if (deactivateLegacy) {
    const result = await CMS.updateMany(
      { section: "services", key: { $in: LEGACY_SERVICE_KEYS } },
      { $set: { isActive: false } },
    );
    if (result.modifiedCount > 0) {
      console.log(`  – Deactivated ${result.modifiedCount} legacy service(s)`);
    }
  }

  console.log(`Done — ${DEFAULT_CMS_SERVICES.length} services active in database.`);
};

const seedServices = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await upsertServices();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Service seed failed:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedServices();
}

module.exports = { upsertServices, DEFAULT_CMS_SERVICES };
