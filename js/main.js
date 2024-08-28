document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "https://pokeapi.co/api/v2/";
  const maxPokemonId = 1025;

  const btnSearch = document.getElementById("search");
  const btnPrevious = document.getElementById("previous");
  const btnNext = document.getElementById("next");
  const inputField = document.getElementById("pokemonNameOrId");
  const pokemonInfoDiv = document.getElementById("pokemonInfo");
  const myPokemonsDiv = document.getElementById("myPokemons");
  const modal = document.getElementById("myPokemonsModal");
  const closeModalBtn = document.getElementById("closeModal");
  const viewMyPokemonsBtn = document.getElementById("viewMyPokemons");

  let myPokemons = JSON.parse(localStorage.getItem("myPokemons")) || []; 

  async function fetchAndDisplayPokemon(query) {
    try {
      const response = await fetch(`${baseUrl}pokemon/${query}`);
      if (!response.ok) {
        throw new Error("Pokémon non trouvé");
      }
      const data = await response.json();
      displayPokemon(data);
    } catch (error) {
      pokemonInfoDiv.innerHTML = `<p>${error.message}</p>`;
    }
  }

  function displayPokemon(pokemonData) {
    const { name, id, weight, height, types, abilities, sprites } = pokemonData;
    const pokemonInfoContainer = document.querySelector(
      ".pokemon-info-container"
    );
    const navBtn = document.querySelector(".nav-buttons");
    pokemonInfoContainer.style.display = "flex";
    navBtn.style.display = "flex";

    pokemonInfoDiv.dataset.id = id;
    pokemonInfoDiv.innerHTML = `
          <img src="pokeball.png" class="pokeball" />  
          <img src="${
            sprites.other["official-artwork"].front_default
          }" alt="${name}" class="pokemon-image">
          <h2>${id}</h2>
          <h2>${name}</h2>
          <p><strong>Poids:</strong> ${weight / 10} kg</p>
          <p><strong>Taille:</strong> ${height / 10} m</p>
          <div class="types">
            <strong>Type:</strong>
            ${types
              .map((type) => `<span class="type">${type.type.name}</span>`)
              .join("")}
          </div>
          <div class="abilities">
            <strong>Capacité:</strong>
            ${abilities
              .map(
                (ability) =>
                  `<span class="ability">${ability.ability.name}</span>`
              )
              .join("")}
          </div>
        `;

    const capturePokemon = pokemonInfoDiv.querySelector(".pokeball");
    capturePokemon.addEventListener("click", () => {
      const pokemonId = parseInt(pokemonInfoDiv.dataset.id);

      if (myPokemons.includes(pokemonId)) {
        alert("Vous avez déjà capturé ce Pokémon!");
      } else {
        myPokemons.push(pokemonId);
        localStorage.setItem("myPokemons", JSON.stringify(myPokemons));
        alert("Pokémon capturé!");
      }
    });
  }

  function displayMyPokemons() {
    const myPokemons = JSON.parse(localStorage.getItem("myPokemons")) || [];
    myPokemonsDiv.innerHTML = "";

    myPokemons.forEach((pokemonId) => {
      fetch(`${baseUrl}pokemon/${pokemonId}`)
        .then((response) => response.json())
        .then((pokemonData) => {
          const { id, name, sprites } = pokemonData;
          const pokemonCard = document.createElement("div");
          pokemonCard.classList.add("pokemon-card");
          pokemonCard.innerHTML = `
            <img src="${sprites.other["official-artwork"].front_default}" alt="${name}" class="pokemon-image">
            <h2>${id} - ${name}</h2>
       
          `;

          myPokemonsDiv.appendChild(pokemonCard);
        });
    });
    modal.style.display = "flex";
  }

  function openMyPokemonsModal() {
    displayMyPokemons();
  }

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  viewMyPokemonsBtn.addEventListener("click", openMyPokemonsModal);

  btnSearch.addEventListener("click", () => {
    const query = inputField.value.trim();
    if (query) {
      fetchAndDisplayPokemon(query);
      inputField.value = "";
    } else {
      alert("Veuillez entrer un nom ou un numéro de Pokédex.");
    }
  });

  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnSearch.click();
    }
  });

  btnPrevious.addEventListener("click", () => {
    const currentId = parseInt(pokemonInfoDiv.dataset.id);
    if (currentId && currentId > 1) {
      fetchAndDisplayPokemon(currentId - 1);
    } else if (currentId === 1) {
      fetchAndDisplayPokemon(maxPokemonId);
    } else {
      alert("Veuillez d'abord rechercher un Pokémon.");
    }
  });

  btnNext.addEventListener("click", () => {
    const currentId = parseInt(pokemonInfoDiv.dataset.id);
    if (currentId && currentId < maxPokemonId) {
      fetchAndDisplayPokemon(currentId + 1);
    } else if (currentId === maxPokemonId) {
      fetchAndDisplayPokemon(1);
    } else {
      alert("Veuillez d'abord rechercher un Pokémon.");
    }
  });
});
