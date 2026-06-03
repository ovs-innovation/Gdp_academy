const { getIntegrationStatus } = require("../lib/integrations.js");

const getStatus = async (_req, res) => {
  res.json({
    success: true,
    integrations: getIntegrationStatus(),
  });
};

module.exports = { getStatus };
