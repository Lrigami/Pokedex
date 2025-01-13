let pokemons = []; // Déclare la variable globalement
let pokemonsHW = []; 

const translations = {
  stats: {
    HP: "PV",
    attack: "Attaque",
    defense: "Défense",
    special_attack: "Att. spé.",
    special_defense: "Déf. spé.",
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
const arrowUp = document.getElementById("top");
const arrowDown = document.getElementById("bottom");
const arrowLeft = document.getElementById("previous");
const arrowRight = document.getElementById("next");
const slideToRight = document.getElementById("slider-right");
const slideToLeft = document.getElementById("slider-left");
let sortIdButton;
let sortNameButton;
let sortStatButton;

// number buttons
const numberButtons = document.querySelectorAll("#number-buttons button");

// search
const searchBar = document.getElementById("pokemon-searchbar");
const filterResults = document.getElementById("filter-results");
const deleteButton = document.getElementById("delete-input");
const filterType = document.getElementById("filter-type");
const filterStats = ["attack", "HP", "defense", "special_attack", "special_defense", "speed"];

// lights
const redLight = document.getElementById("red-light");
const yellowLight = document.getElementById("yellow-light");
const greenLight = document.getElementById("green-light")

// Clear pokemon display
function clearPokemonDisplay() {
  currentPokemonId = null;

  pokemonStatistics.classList.remove("hidden");
  filterResults.classList.add("hidden");
  pokemonImage.setAttribute("src", "");
  pokemonImage.setAttribute("alt", "");
  pokemonSprite.setAttribute("src", "");
  pokemonSprite.setAttribute("alt", "");
  pokemonHeight.innerText = '';
  pokemonWeight.innerText = '';
  pokemonName.innerText = '';
  pokemonId.innerText = '';
  pokemonStats.innerHTML = '';
  pokemonStrength.innerHTML = '';
  pokemonWeakness.innerHTML = '';
  pokemonEvolution.innerHTML = '';
  pokemonMainType.innerHTML = '';
  pokemonSecondaryType.classList.add("hidden"); 
}

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

    if (!query) {
      clearPokemonDisplay();
      searchBar.style.backgroundColor = '';
      pokemonName.innerText = '';
      return;
    }

    if (result && resultHW) {
      turnOnLights();
      setTimeout(turnOffLights, 500);
      displayPokemon(result, resultHW);
      searchBar.style.backgroundColor = '#64B5F6';
    } else if (query) {
      clearPokemonDisplay();
      searchBar.style.backgroundColor = 'red';
      pokemonName.innerText = 'Aucun pokémon trouvé.';
    }
  });

  // Gestion des flèches directionnelles
  document.addEventListener('keydown', (event) => {
    if (currentPokemonId === null) return;

    if (event.key === 'ArrowRight') {
      const nextPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId + 1)
      const nextPokemonHW = pokemonsHW.find(pokemonHW => pokemonHW.id === currentPokemonId + 1);
      if (nextPokemon && nextPokemonHW) {
        turnOnLights();
        setTimeout(turnOffLights, 500);
        displayPokemon(nextPokemon, nextPokemonHW);
      }
    } else if (event.key === 'ArrowLeft') {
      const prevPokemon = pokemons.find(pokemon => pokemon.id === currentPokemonId - 1)
      const prevPokemonHW = pokemonsHW.find(pokemonHW => pokemonHW.id === currentPokemonId - 1);
      if (prevPokemon && prevPokemonHW) {
        turnOnLights();
        setTimeout(turnOffLights, 500);
        displayPokemon(prevPokemon, prevPokemonHW);
      }
    } else if (event.key === 'ArrowDown') {
      const sliderHeight = document.getElementById("pokedex-pokemon-img").offsetHeight;
      document.getElementById("pokedex-pokemon-img").scrollTop += sliderHeight;
    } else if (event.key === 'ArrowUp') {
      const sliderHeight = document.getElementById("pokedex-pokemon-img").offsetHeight;
      document.getElementById("pokedex-pokemon-img").scrollTop -= sliderHeight;
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
    if (prevPokemon && prevPokemonHW) {
      displayPokemon(prevPokemon, prevPokemonHW);
    }
  }

  arrowRight.addEventListener('click', () => {
    navigateToNextPokemon();
    turnOnLights();
    setTimeout(turnOffLights, 500);
  });
  
  arrowLeft.addEventListener('click', () => {
    navigateToPreviousPokemon();
    turnOnLights();
    setTimeout(turnOffLights, 500);
  });
}

function turnOnLights() {
  redLight.style.animation = "light 0.3s linear";
  yellowLight.style.animation = "light 0.3s linear 0.1s";
  greenLight.style.animation = "light 0.3s linear 0.2s";
}

function turnOffLights() {
  redLight.style.animation = "";
  yellowLight.style.animation = "";
  greenLight.style.animation = "";
}

function displayPokemon(pokemon, pokemonHW) {
  currentPokemonId = pokemon.id; // Met à jour l'ID actuel
  filterResults.classList.add("hidden");
  pokemonStatistics.classList.remove("hidden");

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
  pokemonId.innerText = `n° ${pokemon.id}`;

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

arrowDown.onclick = () => {
  const sliderHeight = document.getElementById("pokedex-pokemon-img").offsetHeight;
  document.getElementById("pokedex-pokemon-img").scrollTop += sliderHeight;
}

arrowUp.onclick = () => {
  const sliderHeight = document.getElementById("pokedex-pokemon-img").offsetHeight;
  document.getElementById("pokedex-pokemon-img").scrollTop -= sliderHeight;
}

slideToRight.onclick = () => {
  const sliderWidth = document.getElementById("filters-slider").offsetWidth;
  document.getElementById("filters-slider").scrollLeft += sliderWidth;
}

slideToLeft.onclick = () => {
  const sliderWidth = document.getElementById("filters-slider").offsetWidth;
  document.getElementById("filters-slider").scrollLeft -= sliderWidth;
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.value = button.id.replace("button", "");
    searchBar.value += button.value;
    const event = new Event('input', { bubbles: true, cancelable: true });
    searchBar.dispatchEvent(event);
  })
});

deleteButton.addEventListener("click", () => {
  searchBar.value = "";
  searchBar.style.backgroundColor = "";
  clearPokemonDisplay();
})

// Filter pokemons functions
// types array
const types = ["Acier", "Combat", "Dragon", "Eau", "\u00c9lectrik", "F\u00e9e", "Feu", "Glace", "Insecte", "Normal", "Plante", "Poison", "Psy", "Roche", "Sol", "Spectre", "T\u00e9n\u00e8bres", "Vol"];

// filter slider buttons
function displayTypesFilters() {
  filterResults.classList.remove("hidden");
  pokemonStatistics.classList.add("hidden");
  filterResults.innerHTML = `<p>Choisissez un type&nbsp:</p>`;
  let listOfTypes = document.createElement("ul");
  types.forEach((type) => {
    let typeElement = document.createElement("li");
    let typeBtn = document.createElement("button");
    typeBtn.classList.add("type-button");
    typeBtn.innerText = type;
    typeElement.appendChild(typeBtn);
    listOfTypes.appendChild(typeElement);
  });
  filterResults.appendChild(listOfTypes);
}

let listOfFilteredPkmArray;

// filter pkm by types
function filterByType(btn) {
  listOfFilteredPkmArray = [];
  filterResults.innerHTML = `<p id="filter-results-header"><span id="pokemon-num">N°</span><button id="sort-id-btn"><span class="material-icons">expand_all</span></button><span>Pokémon</span><button id="sort-name-btn"><span class="material-icons">expand_all</span></button></p>`;

  pokemons.forEach((pokemon) => {
    if (pokemon.apiTypes[0].name == btn.innerText || (pokemon.apiTypes[1] && pokemon.apiTypes[1].name == btn.innerText)) {
      let pkmObject = { sprite: pokemon.sprite, id: pokemon.id, name: pokemon.name};
      listOfFilteredPkmArray.push(pkmObject);
    }
  })

  displayTypeFilter();
  return listOfFilteredPkmArray;
}

function displayTypeFilter() {
  let listOfFilteredPkm = "";
  listOfFilteredPkm = document.createElement("ul");

  listOfFilteredPkmArray.forEach((pokemon) => {
    let filteredPokemon = document.createElement("li");
    filteredPokemon.classList.add("filtered-pkm");
    let filteredPokemonBtn = document.createElement("button");
    let filteredPokemonSprite = document.createElement("img");
    filteredPokemonSprite.src = pokemon.sprite;
    let filteredPokemonId = document.createElement("span");
    filteredPokemonId.innerText = `${pokemon.id}`;
    let filteredPokemonName = document.createElement("span");
    filteredPokemonName.innerText = pokemon.name;

    filteredPokemonBtn.appendChild(filteredPokemonSprite);
    filteredPokemonBtn.appendChild(filteredPokemonId);
    filteredPokemonBtn.appendChild(filteredPokemonName);

    filteredPokemon.appendChild(filteredPokemonBtn);

    listOfFilteredPkm.appendChild(filteredPokemon);

    filteredPokemonBtn.addEventListener("click", () => {
      clearPokemonDisplay();
      turnOnLights();
      setTimeout(turnOffLights, 500);
      const pkmToDisplay = pokemons.find(pkm => pkm.id === pokemon.id);
      const pkmToDisplayHW = pokemonsHW.find(pkmHW => pkmHW.id === pokemon.id);
      displayPokemon(pkmToDisplay, pkmToDisplayHW);
    })
  })

  filterResults.appendChild(listOfFilteredPkm);
}

function displayStatFilter(stat) {
  let listOfFilteredPkm = "";
  listOfFilteredPkm = document.createElement("ul");
  listOfFilteredPkm.setAttribute("id", "filtered-pkm-list");

  listOfFilteredPkmArray.forEach((pokemon) => {
    let filteredPokemon = document.createElement("li");
    filteredPokemon.classList.add("filtered-pkm");
    let filteredPokemonBtn = document.createElement("button");
    let filteredPokemonSprite = document.createElement("img");
    filteredPokemonSprite.src = pokemon.sprite;
    let filteredPokemonId = document.createElement("span");
    filteredPokemonId.innerText = `${pokemon.id}`;
    let filteredPokemonName = document.createElement("span");
    filteredPokemonName.innerText = pokemon.name;
    let filteredPokemonStat = document.createElement("span");
    filteredPokemonStat.innerText = `${pokemon.stat_name}`;

    filteredPokemonBtn.appendChild(filteredPokemonSprite);
    filteredPokemonBtn.appendChild(filteredPokemonId);
    filteredPokemonBtn.appendChild(filteredPokemonName);
    filteredPokemonBtn.appendChild(filteredPokemonStat);

    filteredPokemon.appendChild(filteredPokemonBtn);

    listOfFilteredPkm.appendChild(filteredPokemon);

    filteredPokemonBtn.addEventListener("click", () => {
      clearPokemonDisplay();
      turnOnLights();
      setTimeout(turnOffLights, 500);
      const pkmToDisplay = pokemons.find(pkm => pkm.id === pokemon.id);
      const pkmToDisplayHW = pokemonsHW.find(pkmHW => pkmHW.id === pokemon.id);
      displayPokemon(pkmToDisplay, pkmToDisplayHW);
    })
  });

  filterResults.appendChild(listOfFilteredPkm);

}

// sort pkm by name
function sortByName() {
  listOfFilteredPkmArray.sort(function(a, b) {
  let x = a.name.toLowerCase();
  let y = b.name.toLowerCase();
  if (x < y) {return -1;}
  if (x > y) {return 1;}
  return 0;});
  console.log(listOfFilteredPkmArray);
  filterResults.removeChild(filterResults.lastChild);
  displayTypeFilter();
}

function sortByNameReverse() {
  listOfFilteredPkmArray.sort(function(a, b) {
  let x = a.name.toLowerCase();
  let y = b.name.toLowerCase();
  if (x > y) {return -1;}
  if (x < y) {return 1;}
  return 0;});
  console.log(listOfFilteredPkmArray);
  filterResults.removeChild(filterResults.lastChild);
  displayTypeFilter();
}

// sort pkm by id
function sortByIncreasingId() {
  listOfFilteredPkmArray.sort(function(a, b) {return a.id - b.id});
  filterResults.removeChild(filterResults.lastChild);
  displayTypeFilter();
}

function sortByDecreasingId() {
  listOfFilteredPkmArray.sort(function(a, b) {return b.id - a.id});
  filterResults.removeChild(filterResults.lastChild);
  displayTypeFilter();
}

function sortByIncreasingStat(stat) {
  listOfFilteredPkmArray.sort(function(a, b){return a.stat_name - b.stat_name});
  if (document.getElementById("filtered-pkm-list")) {
    filterResults.removeChild(filterResults.lastChild);
  }
  displayStatFilter(stat);
}

function sortByDecreasingStat(stat) {
  listOfFilteredPkmArray.sort(function(a, b){return b.stat_name - a.stat_name});
  if (document.getElementById("filtered-pkm-list")) {
    filterResults.removeChild(filterResults.lastChild);
  }
  displayStatFilter(stat);
}

filterType.addEventListener("click", () => {
  displayTypesFilters();
  const typesBtn = document.querySelectorAll(".type-button");
  typesBtn.forEach((btn) => {
    let countName = 0;
    let countId = 0;
    btn.addEventListener("click", () => {
      filterByType(btn); 
      sortIdButton = document.getElementById("sort-id-btn");
      sortNameButton = document.getElementById("sort-name-btn");
      sortNameButton.addEventListener("click", () => {
        if (countName % 2 === 0) {
          sortByName();
          countName++;
        }
        else {
          sortByNameReverse();
          countName++;
        }
      }); 
      sortIdButton.addEventListener("click", () => {
        if (countId % 2 === 0) {
          sortByDecreasingId();
          countId++;
        }
        else {
          sortByIncreasingId();
          countId++;
        }
      }); 
    });
  })
});

// filter pokemon by stats
function filterByStat(stat) {
  listOfFilteredPkmArray = [];
  filterResults.innerHTML = `<p id="filter-results-header"><span id="pokemon-num">N°</span><span>Pokémon</span><span id="pkm-stat-text">${translations.stats[stat]}</span><button id="sort-stat-btn"><span class="material-icons">expand_all</span></button></p>`;

  pokemons.forEach((pokemon) => {
    let pkmObject = { sprite: pokemon.sprite, id: pokemon.id, name: pokemon.name, stat_name: pokemon.stats[stat]};
    listOfFilteredPkmArray.push(pkmObject);
  });
  
  sortByIncreasingStat(stat);
  return listOfFilteredPkmArray;
}

filterStats.forEach((stat) => {
  let countStat = 0;
  let statBtn = document.getElementById(`filter-${stat}`);
  statBtn.addEventListener("click", () => {
    clearPokemonDisplay();
    filterResults.classList.remove("hidden");
    pokemonStatistics.classList.add("hidden");
    filterByStat(stat);
    sortStatButton = document.getElementById("sort-stat-btn");
    sortStatButton.addEventListener("click", () => {
      if (countStat % 2 === 0) {
        sortByDecreasingStat(stat);
        countStat++;
      } else {
        sortByIncreasingStat(stat);
        countStat++;
      }
    })
  })
})