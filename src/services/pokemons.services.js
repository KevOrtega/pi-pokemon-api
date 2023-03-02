const axios = require("axios");
const { Op } = require("sequelize");
const { Pokemon, Stat, Type } = require("../database");
const { setStat } = require("./stats.services");
const { getTypes, setTypes } = require("./types.services");

function getPokemonsOrdered(pokemons, order) {
  const order_methods = {
    alphabeticalASC: (a, b) => (a.name > b.name ? 1 : -1),
    alphabeticalDESC: (a, b) => (a.name < b.name ? 1 : -1),

    heightASC: (a, b) => (a.height > b.height ? 1 : -1),
    heightDESC: (a, b) => (a.height < b.height ? 1 : -1),

    weightASC: (a, b) => (a.weight > b.weight ? 1 : -1),
    weightDESC: (a, b) => (a.weight < b.weight ? 1 : -1),

    hpASC: (a, b) => (a.stat.hp > b.stat.hp ? 1 : -1),
    hpDESC: (a, b) => (a.stat.hp < b.stat.hp ? 1 : -1),

    attackASC: (a, b) => (a.stat.attack > b.stat.attack ? 1 : -1),
    attackDESC: (a, b) => (a.stat.attack < b.stat.attack ? 1 : -1),

    defenseASC: (a, b) => (a.stat.defense > b.stat.defense ? 1 : -1),
    defenseDESC: (a, b) => (a.stat.defense < b.stat.defense ? 1 : -1),

    speedASC: (a, b) => (a.stat.speed > b.stat.speed ? 1 : -1),
    speedDESC: (a, b) => (a.stat.speed < b.stat.speed ? 1 : -1),
  };

  return pokemons.sort(order_methods[order]);
}

async function getPokemonsByTypes(types, pokemons) {
  return pokemons
    ? pokemons.filter((pokemon) => pokemon.types.find(({ name: type }) => types.includes(type)))
    : (
        await axios.all(
          types.map((type) =>
            getTypes(type)
              .then(({ pokemons }) => axios.all(pokemons.map(({ id }) => getPokemonById(id))))
              .catch((_err) => [])
          )
        )
      ).flat();
}

async function getPokemons({ name, order, page = 1, types: types_str }) {
  // const {
  //   data: { results: pokemons },
  // } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100&offset=1100");
  // await axios.all(
  //   pokemons.map(
  //     async ({ url }) =>
  //       await addPokemon(
  //         await axios.get(url).then(({ data }) => ({
  //           name: data.name,
  //           image: data.sprites.front_default,
  //           height: data.height,
  //           weight: data.weight,
  //           stat: Object.fromEntries(data.stats.map((stat) => [stat.stat.name, stat.base_stat])),
  //           types: data.types.map(({ type: { name } }) => name),
  //           created: false,
  //         }))
  //       )
  //   )
  // );
  const types = types_str && types_str.split(",").filter((type) => type !== "created");
  const search_params = name
    ? {
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
        include: [Stat, Type],
      }
    : { include: [Stat, Type] };
  let pokemons =
    types && types.length
      ? order
        ? getPokemonsOrdered(await getPokemonsByTypes(types, name && (await Pokemon.findAll(search_params))), order)
        : await getPokemonsByTypes(types, name && (await Pokemon.findAll(search_params)))
      : order
      ? getPokemonsOrdered(await Pokemon.findAll(search_params), order)
      : await Pokemon.findAll(search_params);

  if (types_str.split(",").includes("created")) pokemons = pokemons.filter((pokemon) => pokemon.created);
  if (!pokemons || !pokemons.length) throw new Error(`${name || "pokemons"} not found`);
  return { pages: Math.ceil(pokemons.length / 12), pokemons: pokemons.slice((page - 1) * 12, (page - 1) * 12 + 12) };
}

async function getPokemonById(id) {
  const pokemon_found = await Pokemon.findOne({ where: { id }, include: [Stat, Type] });
  if (!pokemon_found) throw new Error(`${id} not found`);
  return pokemon_found;
}

async function addPokemon({ types, stat, ...pokemon }) {
  const pokemon_created = await Pokemon.create({ ...pokemon, created: true });

  try {
    if (types) await setTypes(pokemon_created, types);
    await setStat(pokemon_created, stat);
  } catch (error) {
    await pokemon_created.destroy();
    throw new Error(error.message);
  }

  return `${pokemon.name} successfully created`;
}

module.exports = {
  getPokemons,
  getPokemonById,
  addPokemon,
};
