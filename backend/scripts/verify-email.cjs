require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { initEmailTransport, getTransport, getAdminEmail } = require("../lib/emailTransport.js");

(async () => {
  const result = await initEmailTransport();
  if (!result.ready) {
    process.exit(1);
  }
  const to = getAdminEmail();
  await getTransport().sendMail({
    from: `"GDP Studio Test" <${process.env.EMAIL_USER}>`,
    to,
    subject: "GDP Studio — email test OK",
    html: "<p>If you see this in your inbox, email is working.</p>",
  });
  console.log(`✅ Test email sent to ${to}`);
})();
