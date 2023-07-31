class Pokemon {
    constructor(ThumbnailImage, name, type, weight, abilities, height, weakness) {
        this.ThumbnailImage = ThumbnailImage;
        this.name = name;
        this.type = type;
        this.weight = weight;
        this.abilities = abilities;
        this.height = height;
        this.weakness = weakness;
    }

    getCardHtml() {
        return `
        <div class="card" data-name="${this.name}">
        <img src="${this.ThumbnailImage}" alt="${this.name}">
          <h3>${this.name}</h3>
          <p>Tipo: ${this.type}</p>
        </div>
      `;
    }
    
    getModalHtml() {
        return `
        <div class="modal-image-container">
            <img src="${this.ThumbnailImage}" alt="${this.name}">
        </div>
        <h2>${this.name}</h2>
        <p>Tipo: ${this.type}</p>
        <p>Peso: ${this.weight} libras</p>
        <p>Altura: ${this.height} pulgadas</p>
        <p>Habilidades: ${this.abilities.join(", ")}</p>
        <p>Debilidades: ${this.weakness.join(", ")}</p>
      `;
    }
}
let pokemonData = [];
// Función para inicializar la aplicación después de cargar los datos del archivo JSON
async function cargarPokemons() {
    try {
        const response = await fetch('../data/pokedex.json');
        const pokemonsData = await response.json();
        const pokemons = pokemonsData.map(pokemonData => {
            const { ThumbnailImage, name, type, weight, abilities, height, weakness } = pokemonData;
            return new Pokemon(ThumbnailImage, name, type, weight, abilities, height, weakness);
        });
        window.pokemons = pokemons;
        displayPokemonCards(pokemons);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// Función para filtrar los Pokémon por nombre
function filterPokemonByName(pokemonName) {
    return window.pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(pokemonName.toLowerCase()));
}
document.getElementById("searchInput").addEventListener("input", event => {
    const searchTerm = event.target.value.trim();
    const filteredPokemon = filterPokemonByName(searchTerm);
    displayPokemonCards(filteredPokemon);
});
// Función para mostrar los Pokémon en tarjetas agrupados por nombre
function displayPokemonCards(pokemonList) {
    const groupedPokemons = groupPokemonsByName(pokemonList);

    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";

    groupedPokemons.forEach(group => {
        const representativePokemon = group[0]; // Tomamos el primer Pokémon del grupo como representante
        const cardHtml = representativePokemon.getCardHtml();
        cardsContainer.insertAdjacentHTML("beforeend", cardHtml);
    });
}
// Función para agrupar los Pokémon por nombre
function groupPokemonsByName(pokemonList) {
    const groupedPokemons = [];
    const nameSet = new Set();

    pokemonList.forEach(pokemon => {
        if (!nameSet.has(pokemon.name.toLowerCase())) {
            const group = pokemonList.filter(p => p.name.toLowerCase() === pokemon.name.toLowerCase());
            groupedPokemons.push(group);
            nameSet.add(pokemon.name.toLowerCase());
        }
    });

    return groupedPokemons;
}
// Función para mostrar el modal con la información del Pokémon
function displayPokemonModal(pokemonName) {
    const pokemon = window.pokemons.find(pokemon => pokemon.name === pokemonName);
    if (pokemon) {
        const modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = pokemon.getModalHtml();
        const modal = document.getElementById("modal");
        modal.style.display = "flex";
    }
}
// Función para ocultar el modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}
// Evento para abrir el modal al hacer clic en una tarjeta
document.getElementById("cardsContainer").addEventListener("click", event => {
    const clickedCard = event.target.closest(".card");
    if (clickedCard) {
        const pokemonName = clickedCard.dataset.name;
        displayPokemonModal(pokemonName);
    }
});
// Evento para cerrar el modal al hacer clic en el fondo oscuro
document.getElementById("modal").addEventListener("click", event => {
    if (event.target.id === "modal") {
        closeModal();
    }
});
// Mostrar todos los Pokémon al cargar la página
cargarPokemons();