'use strict';

var HOUSE_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_CHECKOUT_TIME = ['12: 00', '13: 00', '14: 00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTO_URLS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg'
];
var TOTAL_PINS = 8;
var PIN_WIDTH = 50;
var MAP_WIDTH = 1200;
var MIN_X = 0;
var MAX_X = MAP_WIDTH - PIN_WIDTH;
var MIN_Y = 130;
var MAX_Y = 630;
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapFilters = map.querySelector('.map__filters-container');
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var templateCard = document.querySelector('#card').content.querySelector('.map__card');

var activeMap = function () {
  map.classList.remove('map--faded');

  renderPin(getArrayAds(TOTAL_PINS));
  renderCard(getArrayAds(TOTAL_PINS), TOTAL_PINS);
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomElementArr = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

var getAvatar = function (number) {
  return 'img/avatars/user' + (number < 10 ? '0' + number : number) + '.png';
};

var getRandomLengthArr = function (arr) {
  return arr.slice(0, arr.indexOf(getRandomElementArr(arr)) + 1);
};

var declensionWords = function (totalRooms, totalQuests) {
  var message = totalRooms;

  if (totalRooms % 10 === 1 && totalRooms % 100 !== 11) {
    message += ' комната ';
  } else if (totalRooms >= 2 && totalRooms <= 4) {
    message += ' комнаты ';
  } else {
    message += ' комнат ';
  }

  if (totalQuests % 10 === 1 && totalQuests % 100 !== 11) {
    message += 'для ' + totalQuests + ' гостя';
  } else {
    message += 'для ' + totalQuests + ' гостей';
  }

  return message;
};

var createAd = function (number) {
  var ad = {
    author: {
      avatar: getAvatar(number)
    },
    offer: {
      title: 'Заголовок ' + number + '-го предложения',
      address: getRandomNumber(0, 650) + ', ' + getRandomNumber(0, 350),
      price: getRandomNumber(0, 1000),
      type: getRandomElementArr(HOUSE_TYPES),
      rooms: getRandomNumber(0, 7),
      guests: getRandomNumber(1, 15),
      checkin: getRandomElementArr(CHECKIN_CHECKOUT_TIME),
      checkout: getRandomElementArr(CHECKIN_CHECKOUT_TIME),
      features: getRandomLengthArr(FEATURES),
      description: 'строка с описанием предложенного объявления',
      photos: getRandomLengthArr(PHOTO_URLS)
    },
    location: {
      x: getRandomNumber(MIN_X, MAX_X),
      y: getRandomNumber(MIN_Y, MAX_Y)
    }
  };

  return ad;
};

var getArrayAds = function (total) {
  var ads = [];

  for (var i = 1; i <= total; i++) {
    ads.push(createAd(i));
  }

  return ads;
};

var renderPin = function (ads) {
  var pinFragment = document.createDocumentFragment();

  for (var i = 0; i < TOTAL_PINS; i++) {
    var ad = ads[i];

    var newPinTemplate = templatePin.cloneNode(true);
    newPinTemplate.querySelector('img').src = ad.author.avatar;
    newPinTemplate.querySelector('img').alt = ad.offer.title;
    newPinTemplate.style = 'left: ' + (ad.location.x) + 'px; top: ' + (ad.location.y) + 'px;';
    pinFragment.appendChild(newPinTemplate);
  }

  mapPins.appendChild(pinFragment);
};

var getTypeHouse = function (typeHouse) {
  var type = '';

  switch (typeHouse) {
    case 'palace':
      type = 'Дворец';
      break;
    case 'flat':
      type = 'Квартира';
      break;
    case 'house':
      type = 'Дом';
      break;
    case 'bungalo':
      type = 'Бунгало';
      break;
  }

  return type;
};

var renderCard = function (ads, number) {
  var cardsFragment = document.createDocumentFragment();

  for (var i = 0; i < number; i++) {
    var ad = ads[i];

    var newCardTemplate = templateCard.cloneNode(true);
    newCardTemplate.querySelector('.popup__avatar').src = ad.author.avatar;
    newCardTemplate.querySelector('.popup__title').textContent = ad.offer.title;
    newCardTemplate.querySelector('.popup__text--address').textContent = ad.offer.address;
    newCardTemplate.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    newCardTemplate.querySelector('.popup__type').textContent = getTypeHouse(ad.offer.type);
    newCardTemplate.querySelector('.popup__text--capacity').textContent = declensionWords(ad.offer.rooms, ad.offer.guests);
    newCardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    newCardTemplate.querySelector('.popup__description').textContent = ad.offer.description;
    renderFeature(ad.offer.features);
    renderPhotos(ad.offer.photos);

    cardsFragment.appendChild(newCardTemplate);
  }

  map.insertBefore(cardsFragment, mapFilters);
};

var renderFeature = function (features) {
  var featuresFragment = document.createDocumentFragment();
  var featureList = templateCard.querySelector('.popup__features');
  featureList.innerHTML = '';

  for (var i = 0; i < features.length; i++) {
    var newFeature = document.createElement('li');
    newFeature.classList.add('popup__feature');
    newFeature.classList.add('popup__feature--' + features[i]);
    featuresFragment.appendChild(newFeature);
  }

  if (features.length > 0) {
    featureList.appendChild(featuresFragment);
  } else {
    featureList.classList.add('hidden');
  }
};

var renderPhotos = function (photos) {
  var photosFragment = document.createDocumentFragment();
  var photosList = templateCard.querySelector('.popup__photos');
  var photoItem = photosList.querySelector('.popup__photo');
  photosList.innerHTML = '';

  for (var i = 0; i < photos.length; i++) {
    var newPhoto = photoItem.cloneNode(true);
    newPhoto.src = photos[i];
    photosFragment.appendChild(newPhoto);
  }

  if (photos.length > 0) {
    photosList.appendChild(photosFragment);
  } else {
    photosList.classList.add('hidden');
  }
};

activeMap();
