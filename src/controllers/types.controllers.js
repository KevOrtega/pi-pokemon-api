const services = require("../services/types.services");

async function getTypes(_req, res) {
  res.send(await services.getTypes());
}

module.exports = {
  getTypes,
};
