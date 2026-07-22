/** Short-lived in-memory cache for public read endpoints. */
const store = new Map();

const DEFAULT_TTL_MS = 60_000;

function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { data, expires: Date.now() + ttlMs });
}

async function withPublicCache(key, ttlMs, fn) {
  const cached = getCached(key);
  if (cached !== null) return cached;
  const data = await fn();
  setCache(key, data, ttlMs);
  return data;
}

function invalidatePublicCache(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

module.exports = {
  withPublicCache,
  invalidatePublicCache,
};
