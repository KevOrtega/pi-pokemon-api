// const axios = require("axios");
const { Op } = require("sequelize");
const { Pokemon, Type } = require("../database");

async function getTypes(name) {
  // const {
  //   data: { results: types },
  // } = await axios.get("https://pokeapi.co/api/v2/type");

  // await Promise.all(types.map(async ({ name }) => await Type.create({ name })));
  return name
    ? await Type.findOne({
        where: {
          name: {
            [Op.substring]: name,
          },
        },
        include: Pokemon,
      })
    : await Type.findAll();
}

async function setTypes(pokemon, types) {
  const types_id = await Promise.all(
    types.map(async (type) => {
      const type_matched = await getTypes(type);
      if (!type_matched) throw new Error(`type "${type}" not found`);
      return type_matched.id;
    })
  );

  await pokemon.addTypes(types_id);
}

module.exports = {
  getTypes,
  setTypes,
};
