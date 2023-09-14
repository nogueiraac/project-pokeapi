// scripts do slide principal
var slide_hero = new Swiper(".slide-hero", {
  effect: 'fade',
  pagination: {
    el: ".slide-hero .main-area .area-explore .swiper-pagination",
  },
});

const cardPokemon  = document.querySelectorAll('.js-open-details-pokemon');
const btnCloseModal = document.querySelector('.js-close-modal-details-pokemon');
const countPokemons = document.getElementById('js-count-pokemons');

cardPokemon.forEach(card => {
  card.addEventListener('click', openDetailsPokemon);
})

if(btnCloseModal) {
  btnCloseModal.addEventListener('click', closeDetailsPokemon);
}

const btnDropdownSelect = document.querySelector('.js-open-select-custom');

btnDropdownSelect.addEventListener('click', () => {
  btnDropdownSelect.parentElement.classList.toggle('active');
})

const areaPokemons = document.getElementById('js-list-pokemons');

function upperCaseFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Creating card of pokemons

function createCardPokemon(pokemonInfo) {
  const { name, type, code, image } = pokemonInfo;

  let card = document.createElement('div');
  card.classList = `card-pokemon js-open-details-pokemon ${type}`;
  areaPokemons.appendChild(card);

  let pokemonImage = document.createElement('div');
  pokemonImage.classList = 'image';
  card.appendChild(pokemonImage);

  let imageSrc = document.createElement('img');
  imageSrc.className = 'thumb-img';
  imageSrc.setAttribute('src', image);
  pokemonImage.appendChild(imageSrc);

  let infoCardPokemon = document.createElement('div');
  infoCardPokemon.classList = 'info';
  card.appendChild(infoCardPokemon);

  let infoTextPokemon = document.createElement('div');
  infoTextPokemon.classList = 'text';
  infoCardPokemon.appendChild(infoTextPokemon);

  let codePokemon = document.createElement('span');
  codePokemon.textContent = (code < 10) ? `#00${code}` : (code < 100) ? `#0${code}` : `#${code}`;
  infoTextPokemon.appendChild(codePokemon);

  let namePokemon = document.createElement('h3');
  namePokemon.textContent = upperCaseFirstChar(name);
  infoTextPokemon.appendChild(namePokemon);

  let areaIcon = document.createElement('div');
  areaIcon.classList = 'icon';
  infoCardPokemon.appendChild(areaIcon);

  let imageType = document.createElement('img');
  imageType.setAttribute('src', `img/icon-types/${type}.svg`);
  areaIcon.appendChild(imageType);

}

// Listing pokemons

function listingPokemons(urlApi) {
  axios({
    method: 'GET',
    url: urlApi
  }).then(response => {
    const { results, next, count } = response.data;

    countPokemons.innerText = count;

    results.forEach(pokemon => {
      let urlApiDetails = pokemon.url;

      axios({
        method: 'GET',
        url: `${urlApiDetails}`
      }).then(response => {
        const { name, id, sprites, types } = response.data;

        const infoCard = {
          name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name
        };

        createCardPokemon(infoCard);

        const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');

        cardPokemon.forEach(card => {
          card.addEventListener('click', openDetailsPokemon);
        })
      })
    })
  })
};

listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

function openDetailsPokemon() {
  document.documentElement.classList.add('open-modal');
};

function closeDetailsPokemon() {
  document.documentElement.classList.remove('open-modal');
};

// Listing types list

const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.querySelector('.dropdown-select');

axios({
  method: 'GET',
  url: 'https://pokeapi.co/api/v2/type',
}).then(response => {
  const { results } = response.data;

  results.forEach((type, index) => {
    if (type.name !== 'unknown' && type.name !== 'shadow') {
      let itemType = document.createElement('li');
      areaTypes.appendChild(itemType);

      let buttonType = document.createElement('button');
      buttonType.classList = `type-filter ${type.name}`;
      itemType.appendChild(buttonType);

      let iconType = document.createElement('div');
      iconType.classList = 'icon';
      buttonType.appendChild(iconType);

      let srcType = document.createElement('img');
      srcType.setAttribute('src', `img/icon-types/${type.name}.svg`);
      iconType.appendChild(srcType);

      let nameType = document.createElement('span');
      nameType.textContent = upperCaseFirstChar(type.name);
      buttonType.appendChild(nameType);


      // Mobile
      let itemTypeMobile = document.createElement('li');
      areaTypesMobile.appendChild(itemTypeMobile);

      let buttonTypeMobile = document.createElement('button');
      buttonTypeMobile.classList = `type-filter ${type.name}`;
      itemTypeMobile.appendChild(buttonTypeMobile);

      let iconTypeMobile = document.createElement('div');
      iconTypeMobile.classList = 'icon';
      buttonTypeMobile.appendChild(iconTypeMobile);

      let srcTypeMobile = document.createElement('img');
      srcTypeMobile.setAttribute('src', `img/icon-types/${type.name}.svg`);
      iconTypeMobile.appendChild(srcTypeMobile);

      let nameTypeMobile = document.createElement('span');
      nameTypeMobile.textContent = upperCaseFirstChar(type.name);
      buttonTypeMobile.appendChild(nameTypeMobile);
    }
  })
})

// Load More

const btnLoadMore = document.getElementById('js-btn-load-more');

let countPagination = 10;

function showMorePokemons() {
  listingPokemons(`https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`);

  countPagination += 9;
}

btnLoadMore.addEventListener('click', showMorePokemons);