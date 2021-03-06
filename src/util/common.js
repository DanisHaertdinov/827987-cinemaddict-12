import {LOREUM} from '../const.js';
import moment from 'moment';

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
  const randomLength = getRandomInteger(1, maxLength);
  return shuffleArray(LOREUM).slice(0, randomLength).join(``);
};

const getRandomDate = () => {
  const start = new Date(`01-01-1985`).getTime();
  const end = new Date().getTime();
  return new Date(start + Math.random() * (end - start));
};

const getRandomLengthArray = function (array) {
  return shuffleArray(array).slice(getRandomInteger(0, array.length - 1));
};

const prettifyDuration = (duration) => {
  return moment.utc().startOf(`day`).add({minutes: duration}).format(`H[h] mm[m]`);
};

const filterByProperty = (items, criteria) => {
  return items.filter((item) => item[criteria]);
};

const formatDate = (date, format) => {
  return moment(date).format(format);
};

const humanizeDate = (date) => {
  return moment(date).fromNow();
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateIds = (count) => {
  return new Array(count).fill().map(generateId);
};

export {
  getRandomInteger,
  getRandomArrayElement,
  shuffleArray,
  generateRandomText,
  getRandomDate,
  getRandomLengthArray,
  prettifyDuration,
  filterByProperty,
  formatDate,
  humanizeDate,
  generateId,
  generateIds,
};
