const services = require("../services/pokemons.services");
const { validatePokemon } = require("../validation");

async function getPokemons({ query }, res) {
  try {
    res.send(await services.getPokemons(query));
  } catch (error) {
    res.status(404).send(error.message);
  }
}

async function getPokemonById(req, res) {
  try {
    res.send(await services.getPokemonById(req.params.id));
  } catch (error) {
    res.status(404).send(error.message);
  }
}

async function addPokemon(req, res) {
  try {
    validatePokemon(req.body);

    res.status(201).send(await services.addPokemon(req.body));
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  getPokemons,
  getPokemonById,
  addPokemon,
};
