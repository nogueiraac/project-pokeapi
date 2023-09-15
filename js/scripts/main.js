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

function getPokemonInfoForCard(pokemon) {
  const { name, id, sprites, types } = pokemon;
  
  const infoCard = {
    name,
    code: id,
    image: sprites.other.dream_world.front_default,
    type: types[0].type.name
  };

  if(infoCard.image) {
    createCardPokemon(infoCard);
  }

  const cardPokemon = document.querySelectorAll('.js-open-details-pokemon');
  cardPokemon.forEach(card => {
    card.addEventListener('click', openDetailsPokemon);
  });
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
        getPokemonInfoForCard(response.data);
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
      buttonType.setAttribute('code-type', index + 1);
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
      buttonTypeMobile.setAttribute('code-type', index + 1);
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

      const allTypes = document.querySelectorAll('.type-filter');

      allTypes.forEach(btn => {
        btn.addEventListener('click', filterByTypes);
      })
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


// filter

function filterByTypes() {
  let idPokemon = this.getAttribute('code-type');

  const areaPokemons = document.getElementById('js-list-pokemons');
  const btnLoadMore = document.getElementById('js-btn-load-more');

  const allTypes = document.querySelectorAll('.type-filter');

  areaPokemons.innerHTML = "";
  btnLoadMore.style.display = "none";

  const sectionPokemons = document.querySelector('.s-all-info-pokemons');
  const topSection = sectionPokemons.offsetTop;

  window.scrollTo({
    top: topSection + 288,
    behavior: 'smooth'
  });

  allTypes.forEach(type => {
    type.classList.remove('active');
  });

  this.classList.add('active');

  if(idPokemon) {
    axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${idPokemon}`
    }).then(response => {
      const { pokemon } = response.data;
      countPokemons.textContent = pokemon.length;
  
      pokemon.forEach(item => {
        const { url } = item.pokemon;
  
        axios({
          method: 'GET',
          url
        }).then(response => {
          getPokemonInfoForCard(response.data);
        });
      });
    });
  } else {
    areaPokemons.innerHTML = "";
    listingPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');
    btnLoadMore.style.display = "block";
  }
}

// search

const btnSearch = document.getElementById('js-btn-search');
const inputSearch = document.getElementById('js-input-search');

inputSearch.addEventListener('keyup', (event) => {
  if(event.code === 'Enter') {
    searchPokemon();
  }
})

function searchPokemon() {
  console.log(inputSearch);
  let valueInput = inputSearch.value.toLowerCase();
  const typeFilter = document.querySelectorAll('.type-filter');

  typeFilter.forEach(type => {
    type.classList.remove('active');
  });

  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`
  }).then(response => {
    areaPokemons.innerHTML = "";
    btnLoadMore.style.display = "none";
    countPokemons.textContent = 1;

    getPokemonInfoForCard(response.data);
  }).catch(error => {
    areaPokemons.innerHTML = "";
    btnLoadMore.style.display = "none";
    countPokemons.textContent = 0;

    alert('Pokemon Not Found :(');
  })

}
  
btnSearch.addEventListener('click', searchPokemon);