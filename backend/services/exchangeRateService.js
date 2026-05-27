const axios = require("axios");

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const EXCHANGE_RATE_API_URL =
  process.env.EXCHANGE_RATE_API_URL || "https://v6.exchangerate-api.com/v6";
const BASE_CURRENCY = "USD";
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

/** In-memory cache (replaces Redis until re-enabled later) */
let memoryCache = null;
let memoryCacheTimestamp = null;

const FALLBACK_RATES = {
  USD: 1,
  INR: 83.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.0,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34,
  AED: 3.67,
  SAR: 3.75,
};

const isExchangeRateApiConfigured = () => Boolean(EXCHANGE_RATE_API_KEY);

const getFallbackRates = () => ({
  base: BASE_CURRENCY,
  rates: { ...FALLBACK_RATES },
  timestamp: Date.now(),
  cacheAge: 0,
  isStale: false,
  source: "fallback",
});

const fetchRatesFromAPI = async () => {
  if (!isExchangeRateApiConfigured()) {
    return getFallbackRates();
  }

  try {
    const url = `${EXCHANGE_RATE_API_URL}/${EXCHANGE_RATE_API_KEY}/latest/${BASE_CURRENCY}`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: { Accept: "application/json" },
    });

    if (
      response.data &&
      response.data.result === "success" &&
      response.data.conversion_rates
    ) {
      return {
        base: BASE_CURRENCY,
        rates: response.data.conversion_rates,
        timestamp: response.data.time_last_update_unix * 1000,
      };
    }

    throw new Error("Invalid response from ExchangeRate-API");
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("Exchange rate API rate limit exceeded, using fallback rates");
    } else if (isExchangeRateApiConfigured()) {
      console.warn(
        "Exchange rate API unavailable, using fallback rates:",
        error.message,
      );
    }

    return getFallbackRates();
  }
};

const storeExchangeRates = async (ratesData) => {
  memoryCache = ratesData;
  memoryCacheTimestamp = Date.now();
  return ratesData;
};

const getCachedExchangeRates = async () => {
  if (!memoryCache || !memoryCacheTimestamp) return null;

  const cacheAge = Date.now() - memoryCacheTimestamp;

  return {
    ...memoryCache,
    cacheAge,
    isStale: cacheAge > CACHE_DURATION_MS,
  };
};

const fetchAndStoreExchangeRates = async () => {
  if (!isExchangeRateApiConfigured()) {
    return getFallbackRates();
  }

  const ratesData = await fetchRatesFromAPI();

  if (ratesData.source !== "fallback") {
    await storeExchangeRates(ratesData);
  }

  return ratesData;
};

const getExchangeRates = async (forceRefresh = false) => {
  if (!isExchangeRateApiConfigured()) {
    return getFallbackRates();
  }

  if (!forceRefresh) {
    const cached = await getCachedExchangeRates();
    if (cached && !cached.isStale) return cached;
  }

  return fetchAndStoreExchangeRates();
};

const getExchangeRate = async (targetCurrency) => {
  const ratesData = await getExchangeRates();

  if (targetCurrency === BASE_CURRENCY) return 1;

  const rate = ratesData.rates[targetCurrency];
  if (!rate) {
    throw new Error(
      `Exchange rate not found for currency: ${targetCurrency}`,
    );
  }

  return rate;
};

const convertFromUSD = async (amount, targetCurrency) => {
  if (targetCurrency === BASE_CURRENCY) return amount;

  const rate = await getExchangeRate(targetCurrency);
  return parseFloat((amount * rate).toFixed(2));
};

const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;

  if (fromCurrency === BASE_CURRENCY) {
    return await convertFromUSD(amount, toCurrency);
  }

  if (toCurrency === BASE_CURRENCY) {
    const fromRate = await getExchangeRate(fromCurrency);
    return parseFloat((amount / fromRate).toFixed(2));
  }

  const fromRate = await getExchangeRate(fromCurrency);
  const toRate = await getExchangeRate(toCurrency);
  const usdAmount = amount / fromRate;
  return parseFloat((usdAmount * toRate).toFixed(2));
};

module.exports = {
  storeExchangeRates,
  getCachedExchangeRates,
  fetchAndStoreExchangeRates,
  getExchangeRates,
  getExchangeRate,
  convertFromUSD,
  convertCurrency,
  isExchangeRateApiConfigured,
};
