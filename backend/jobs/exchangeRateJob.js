const cron = require("node-cron");
const {
  fetchAndStoreExchangeRates,
  isExchangeRateApiConfigured,
} = require("../services/exchangeRateService");

let cronJob = null;

const startExchangeRateJob = () => {
  if (cronJob) return;

  if (!isExchangeRateApiConfigured()) {
    console.log("Exchange rates using built-in fallback (no API key configured)");
    return;
  }

  fetchAndStoreExchangeRates().catch(() => {
    /* fetchRatesFromAPI already falls back silently */
  });

  cronJob = cron.schedule(
    "0 */6 * * *",
    async () => {
      try {
        await fetchAndStoreExchangeRates();
      } catch {
        /* optional background refresh */
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    },
  );

  console.log("Exchange rate cron job started (runs every 6 hours)");
};

const stopExchangeRateJob = () => {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log("Exchange rate cron job stopped");
  }
};

module.exports = {
  startExchangeRateJob,
  stopExchangeRateJob,
};
