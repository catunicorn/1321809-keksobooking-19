var USER_AVATAR_TEMPLATE_URL = 'img/avatars/user{{xx}}.png';
var TITLES = [
  'Картонная коробка',
  'Однокомнатный люкс',
  'Мягкий кошачий домик',
  'Огромный пакет',
  'Президентский люкс',
  'Эконом будка',
  'Котячий хостел',
  'Домик на дереве',
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
var DESCRIPTIONS = [
  'Близко к магазинам',
  'Вид на соседний дом',
  'Спальный район',
  'Соседи котики',
  'Бесплатный интернет от соседей',
  'Верхний этаж',
  'Горячая вода, холодной нет',
  'Можно драть диваны',
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];
var TOTAL_PINS = 8;
var mapBlockSize = document.querySelector('.map__pins').clientWidth - 50;
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

var fetchAvatar = function (index) {
  return USER_AVATAR_TEMPLATE_URL.replace('{{xx}}', '0' + (index + 1));
};

var getRandomNumber = function (min, max, index) {
  return Math.round(Math.random() * (max - min) + min);
};

var fetchType = function () {
  var types = ['palace', 'flat', 'house', 'bungalo'];
  return types[Math.floor((Math.random() * types.length))];
};

var fetchCheck = function () {
  var checkTimes = ['12:00', '13:00', '14:00'];
  return checkTimes[Math.floor((Math.random() * checkTimes.length))];
};

var fetchRandomElementsOfArray = function (array) {
  var size = Math.floor((Math.random() * array.length)) + 1;
  var features = shuffle(array);
  return features.slice(0, size);
};

var getRandomAdverts = function (size) {
  var adverts = [];
  for (var i = 0; i < size; i++) {
    adverts[i] = {
      author: {
        avatar: fetchAvatar(i)
      },
      offer: {
        title: TITLES[i],
        address: [getRandomNumber(1, 100), getRandomNumber(1, 100)].join(', '),
        price: getRandomNumber(1, 100, 100) + ' USD',
        type: fetchType(),
        rooms: getRandomNumber(1, 10, 10),
        guests: getRandomNumber(1, 10, 10),
        checkin: fetchCheck(),
        checkout: fetchCheck(),
        features: fetchRandomElementsOfArray(FEATURES),
        description: DESCRIPTIONS[i],
        photos: fetchRandomElementsOfArray(PHOTOS)
      },
      location: {
        x: getRandomNumber(1, mapBlockSize),
        y: getRandomNumber(130, 630)
      }
    };
  }
  return adverts;
};

var activateMap = function () {
  document.querySelector('.map').classList.remove('map--faded');
};
activateMap();

var renderPin = function (ads) {
  var fragment = document.createDocumentFragment();
  var newPinTemplate;
  for (var i = 0; i < ads.length; i++) {
    newPinTemplate = templatePin.cloneNode(true);
    newPinTemplate.querySelector('img').src = ads[i].author.avatar;
    newPinTemplate.querySelector('img').alt = ads[i].offer.title;
    newPinTemplate.style = 'left: ' + (ads[i].location.x) + 'px; top: ' + (ads[i].location.y) + 'px;';
    fragment.appendChild(newPinTemplate);
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

renderPin(getRandomAdverts(TOTAL_PINS));
