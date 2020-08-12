import {LOREUM} from './const.js';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

const shuffleArray = function (array) {
  let j;
  let temp;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

const generateRandomText = (maxLength) => {
  const randomIndex = getRandomInteger(1, maxLength);
  return shuffleArray(LOREUM).slice(0, randomIndex).join(``);
};

const getRandomDate = () => {
  const start = new Date(`01-01-1985`).getTime();
  const end = new Date().getTime();
  return new Date(start + Math.random() * (end - start));
};

const getRandomLengthArray = function (array) {
  return shuffleArray(array).slice(getRandomInteger(0, array.length - 1));
};

const cutText = (text, from, to) => {
  return text.slice(from, to);
};

export {
  getRandomInteger,
  getRandomArrayElement,
  shuffleArray,
  generateRandomText,
  getRandomDate,
  getRandomLengthArray,
  cutText,
};
