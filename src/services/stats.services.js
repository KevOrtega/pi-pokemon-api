const { Stat } = require("../database");

async function setStat(pokemon, stat) {
  await pokemon.setStat((await Stat.create(stat)).id);
}

module.exports = {
  setStat,
};
