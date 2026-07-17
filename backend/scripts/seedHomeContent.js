require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db.js");
const PageContent = require("../models/pageContentModel.js");
const Settings = require("../models/settingsModel.js");
const { upsertServices } = require("./seedServices.js");
const {
  DEFAULT_HOME_PAGE,
  DEFAULT_SETTINGS_PATCH,
} = require("./data/defaultHomePage.js");

const upsertHomePage = async () => {
  const { slug, title, content, metaTitle, metaDescription, status } =
    DEFAULT_HOME_PAGE;

  const existing = await PageContent.findOne({ slug });
  if (existing) {
    existing.title = title;
    existing.content = content;
    existing.metaTitle = metaTitle;
    existing.metaDescription = metaDescription;
    existing.status = status;
    await existing.save();
    console.log(`  ↻ Updated page content: ${slug}`);
  } else {
    await PageContent.create({
      slug,
      title,
      content,
      metaTitle,
      metaDescription,
      status,
    });
    console.log(`  ✓ Created page content: ${slug}`);
  }
};

const patchSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(DEFAULT_SETTINGS_PATCH);
    console.log("  ✓ Created settings document");
    return;
  }

  Object.assign(settings, DEFAULT_SETTINGS_PATCH);
  await settings.save();
  console.log("  ↻ Updated settings (whatsapp, hero subtitle, etc.)");
};

const seedHomeContent = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB(process.env.MONGO_URI);

    console.log("Upserting homepage CMS content...");
    await upsertHomePage();

    console.log("Patching site settings...");
    await patchSettings();

    console.log("Upserting services CMS...");
    await upsertServices({ deactivateLegacy: true });

    console.log("Done — homepage content is in the database.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Home content seed failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

if (require.main === module) {
  seedHomeContent();
}

module.exports = { upsertHomePage, patchSettings, seedHomeContent };
