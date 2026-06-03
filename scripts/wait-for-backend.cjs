/**
 * Blocks until backend /api/health responds (used before starting Vite).
 */
const http = require("http");
const { getBackendUrl } = require("./dev-backend-url.cjs");

const base = getBackendUrl();
const healthUrl = `${base}/api/health`;
const maxAttempts = 90;

function ping() {
  return new Promise((resolve) => {
    const req = http.get(healthUrl, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

(async () => {
  for (let i = 0; i < maxAttempts; i++) {
    if (await ping()) {
      console.log(`✅ Backend ready at ${base}`);
      process.exit(0);
    }
    if (i === 0) {
      console.log(`⏳ Waiting for backend at ${base} ...`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.error("\n❌ Backend is not running — frontend cannot load CMS/API data.\n");
  console.error("   Fix (pick one):\n");
  console.error("   • From project root:  npm run dev");
  console.error("   • Or in backend/:    npm run dev\n");
  process.exit(1);
})();
