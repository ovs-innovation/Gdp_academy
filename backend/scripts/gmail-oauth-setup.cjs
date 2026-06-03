/**
 * One-time Gmail OAuth setup (when App Password keeps failing).
 * 1. Google Cloud Console → create OAuth Client (Desktop app)
 * 2. Add to backend/.env: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET
 * 3. Run: npm run email:oauth-setup
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const readline = require("readline");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const path = require("path");

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const redirectUri = "http://localhost:3000";

if (!clientId || !clientSecret) {
  console.error("\nAdd to backend/.env first:\n");
  console.error("GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com");
  console.error("GMAIL_CLIENT_SECRET=your_client_secret\n");
  console.error("Create at: https://console.cloud.google.com/apis/credentials\n");
  process.exit(1);
}

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://mail.google.com/"],
  prompt: "consent",
});

console.log("\n1. Open this URL in browser (login as dristyy13@gmail.com):\n");
console.log(authUrl);
console.log("\n2. Allow access, then copy the ?code=... from redirect URL\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("\nPaste authorization code here: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    if (!tokens.refresh_token) {
      console.error("No refresh_token — revoke app access and run again with prompt=consent");
      process.exit(1);
    }
    console.log("\n✅ Add this line to backend/.env:\n");
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    console.log("Then restart backend: npm start\n");
  } catch (err) {
    console.error("Failed:", err.message);
    process.exit(1);
  }
});
