/**
 * Local network URLs for testing on phone/tablet (same Wi‑Fi as this PC).
 */
const os = require("os");

function getLanAddresses() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return [...new Set(ips)];
}

function printDevNetworkGuide(ports = { frontend: 3000, admin: 8080, backend: 8096 }) {
  const ips = getLanAddresses();
  if (!ips.length) {
    console.log("\n📱 Phone/tablet: connect PC + device to same Wi‑Fi, then use Network URL from Vite above.\n");
    return;
  }

  console.log("\n══════════════════════════════════════════════════════════");
  console.log("📱 OPEN ON PHONE / TABLET (same Wi‑Fi — NOT localhost)");
  console.log("══════════════════════════════════════════════════════════");
  for (const ip of ips) {
    console.log(`   Website:  http://${ip}:${ports.frontend}`);
    console.log(`   Admin:    http://${ip}:${ports.admin}`);
    console.log(`   API:      http://${ip}:${ports.backend}/api/health`);
    console.log("   ---");
  }
  console.log("   ⚠️  Do NOT use localhost on another device — it will not open.");
  console.log("   If blocked: run scripts/allow-dev-firewall.ps1 once (Admin PowerShell).");
  console.log("══════════════════════════════════════════════════════════\n");
}

module.exports = { getLanAddresses, printDevNetworkGuide };
