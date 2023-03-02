function validatePokemon(pokemon) {
  if (!pokemon.name || !pokemon.image || !pokemon.stat || !pokemon.stat.hp || !pokemon.stat.attack || !pokemon.stat.defense)
    throw new Error("name, image, stat.hp, stat.atack and stat.defense are needed");

  const validate_methods = {
    name: () => {
      if (typeof pokemon.name !== "string" || !pokemon.name.length) throw new Error("name must be an string");
    },
    image: () => {
      if (typeof pokemon.image !== "string" || !pokemon.image.length) throw new Error("image must be an string");
    },
    height: () => {
      if (typeof pokemon.height !== "number") throw new Error("height must be a number");
    },
    weight: () => {
      if (typeof pokemon.weight !== "number") throw new Error("weight must be a number");
    },
    types: () => {
      if (!Array.isArray(pokemon.types) || pokemon.types.find((type) => typeof type !== "string"))
        throw new Error("types must be an array of strings");
    },
  };
  const { stat, ...attributes } = pokemon;

  Object.keys(attributes).forEach((key) => {
    if (!validate_methods[key]) throw new Error(`${key} is not a valid attribute`);

    validate_methods[key]();
  });

  const valid_stat = ["hp", "attack", "defense", "speed"];
  Object.keys(stat).forEach((key) => {
    if (!valid_stat.includes(key)) throw new Error(`stat.${key} is not valid`);

    if (typeof stat[key] !== "number") throw new Error(`stat.${key} must be a number`);
  });
}

module.exports = {
  validatePokemon,
};
