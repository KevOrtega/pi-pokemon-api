const router = require("express").Router();
const { getPokemons, getPokemonById, addPokemon } = require("../controllers/pokemons.controllers");

router.get("/", getPokemons);
router.get("/:id", getPokemonById);
router.post("/", addPokemon);

module.exports = router;
