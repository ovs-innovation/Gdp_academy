/** Prevent browsers/CDNs from caching dynamic CMS/API responses. */
function noStoreCache(_req, res, next) {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}

module.exports = { noStoreCache };
