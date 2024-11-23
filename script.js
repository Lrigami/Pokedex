let pokemons = []; // Déclare la variable globalement
let pokemonsHW = []; 

const translations = {
  stats: {
    HP: "PV",
    attack: "Attaque",
    defense: "Défense",
    special_attack: "Attaque spéciale",
    special_defense: "Défense spéciale",
    speed: "Vitesse"
  },
  damage_relation: {
    resistant: "Résistant",
    twice_resistant: "Très résistant",
    vulnerable: "Vulnérable",
    no_effect: "Sans effet"
  },
  misc: {
    types: "Types",
    evolutions: "Évolutions",
    strengths: "Forces",
    weaknesses: "Faiblesses",
    stats: "Statistiques"
  }
};

// pokemon info 
const pokemonImage = document.getElementById("pokemon-img");
const pokemonSprite = document.getElementById("pokemon-sprite");
const pokemonHeight = document.getElementById("pokemon-height");
const pokemonWeight = document.getElementById("pokemon-weight");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const pokemonStatistics = document.getElementById("pokemon-statistics");
const pokemonStats = document.getElementById("stats-text");
const pokemonStrength = document.getElementById("strengths-text");
const pokemonWeakness = document.getElementById("weaknesses-text");
const pokemonEvolution = document.getElementById("evolution-text");
const pokemonMainType = document.getElementById("main-type");
const pokemonSecondaryType = document.getElementById("secondary-type");

// buttons
const arrowTop = document.getElementById("top");
const arrowDown = document.getElementById("bottom");
const arrowLeft = document.getElementById("previous");
const arrowRight = document.getElementById("next");

// search
const searchBar = document.getElementById("pokemon-searchbar");
const enteredId = document.getElementById("entered-id");
const filterResults = document.getElementById("filter-results");

// Charger le fichier JSON pour les données sur les pokémons
fetch('./data/pokebuildAPI.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données.');
    }
    return response.json();
  })
  .then(data => {
    pokemons = data; // Remplit la variable avec les données
    console.log('Données chargées :', pokemons);

    // Initialise l'écouteur de la barre de recherche
    initSearchListener();
  })
  .catch(error => {
    console.error('Erreur :', error);
  });

// Charger le fichier JSON pour la taille et poids des pokémons
fetch('./data/height_weight.json')
  .then(response => {
    if(!response.ok) {
      throw new Error('Erreur lors du chargement des données.');
    }
    return response.json();
  })
  .then(data => {
    pokemonsHW = data; // Remplit la variable avec les données 
    console.log('Données chargées :', pokemonsHW);
  })
  .catch(error => {
    console.log('Erreur :', error);
  })

let currentPokemonId = null; // Suivi de l'ID du Pokémon actuellement affiché

// Fonction de recherche de pokémons par ID ou par Nom
function initSearchListener() {
  // Barre de recherche
  searchBar.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();

    // Recherche par ID ou nom
    const result = pokemons.find(pokemon =>
      pokemon.id === parseInt(query) || pokemon.name.toLowerCase() === query
    );

    const resultHW = pokemonsHW.find(pokemonHW => 
      pokemonHW.id === parseInt(query) || pokemonHW.nom.toLowerCase() === query
    );

    if (result && resultHW) {
      displayPokemon(result, resultHW);
    } else if (query) {
      pokemonName.innerText = 'Aucun pokémon';
    }
  });

  // Gestion des flèches directionnelles
  document.addEventListener('keydown', (event) => {
    if (currentPokemonId === null) return;

    if (event.key === 'ArrowRight') {
      const nextPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId + 1)
      const nextPokemonHW = pokemonsHW.find(pokemonHW => pokemonHW.id === currentPokemonId + 1);
      if (nextPokemon && nextPokemonHW) {
        displayPokemon(nextPokemon, nextPokemonHW);
      }
    } else if (event.key === 'ArrowLeft') {
      const prevPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId - 1)
      const prevPokemonHW = pokemonsHW.find(pokemonHW => pokemonHW.id === currentPokemonId - 1);
      if (prevPokemon && prevPokemonHW) {
        displayPokemon(prevPokemon, prevPokemonHW);
      }
    }
  });

  // Gestion des flèches cliquables (HTML)
  function navigateToNextPokemon() {
    const nextPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId + 1)
    const nextPokemonHW = pokemonsHW.find(pokemonHW => pokemonHW.id === currentPokemonId + 1);
    if (nextPokemon && nextPokemonHW) {
      displayPokemon(nextPokemon, nextPokemonHW);
    }
  }

  function navigateToPreviousPokemon() {
    const prevPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId - 1)
    const prevPokemonHW = pokemonsHW.find(pokemonHW => pokemonHW.id === currentPokemonId - 1);
    if (prevPokemon, prevPokemonHW) {
      displayPokemon(prevPokemon, prevPokemonHW);
    }
  }

  arrowRight.addEventListener('click', navigateToNextPokemon);
  arrowLeft.addEventListener('click', navigateToPreviousPokemon);
}

function displayPokemon(pokemon, pokemonHW) {
  currentPokemonId = pokemon.id; // Met à jour l'ID actuel

  const resistances = pokemon.apiResistances
    .filter(res => res.damage_relation === 'resistant' || res.damage_relation === 'twice_resistant')
    .map(res => `<li>${res.name} (${translations.damage_relation[res.damage_relation]}: ${res.damage_multiplier}x)</li>`).join('');

  const vulnerabilities = pokemon.apiResistances
    .filter(res => res.damage_relation === 'vulnerable')
    .map(res => `<li>${res.name} (${translations.damage_relation[res.damage_relation]}: ${res.damage_multiplier}x)</li>`).join('');

  const evolutions = pokemon.apiEvolutions.length > 0
    ? pokemon.apiEvolutions.map(evo => `<li>${evo.name} (#${evo.pokedexId})</li>`).join('')
    : '<li>Aucune évolution disponible.</li>';

  const stats = Object.entries(pokemon.stats)
    .map(([stat, value]) => `<li>${translations.stats[stat] || stat}: ${value}</li>`).join('');

  pokemonImage.setAttribute("src", `${pokemon.image}`);
  pokemonImage.setAttribute("alt", `${pokemon.name}`);
  pokemonSprite.setAttribute("src", `${pokemon.sprite}`);
  pokemonSprite.setAttribute("alt", `${pokemon.name}`);

  pokemonHeight.innerText = ` ${pokemonHW.taille} cm`;
  pokemonWeight.innerText = ` ${pokemonHW.poids} kg`;
  pokemonName.innerText = `${pokemon.name}`;
  pokemonId.innerText = `${pokemon.id}`;

  pokemonStats.innerHTML = `<ul type="none">${stats}</ul>`;
  pokemonStrength.innerHTML = `<ul type="none">${resistances || '<li>Aucune force détectée.</li>'}</ul>`;
  pokemonWeakness.innerHTML = `<ul type="none">${vulnerabilities || '<li>Aucune faiblesse détectée.</li>'}</ul>`;
  pokemonEvolution.innerHTML = `<ul type="none">${evolutions}</ul>`;

  pokemonMainType.innerHTML = 
    `<img src="${pokemon.apiTypes[0].image}" alt="${pokemon.apiTypes[0].name}" title="${pokemon.apiTypes[0].name}">
    <span>${pokemon.apiTypes[0].name}</span>`;

    if (pokemon.apiTypes[1]) {
      pokemonSecondaryType.classList.remove("hidden");
      pokemonSecondaryType.innerHTML = 
        `<img src="${pokemon.apiTypes[1].image}" alt="${pokemon.apiTypes[1].name}" title="${pokemon.apiTypes[1].name}">
        <span>${pokemon.apiTypes[1].name}</span>`;
    } else {
      pokemonSecondaryType.classList.add("hidden");
    }


}
