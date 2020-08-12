import {getRandomArrayElement, generateRandomText, getRandomInteger, getRandomDate, getRandomLengthArray} from '../util.js';
import {TITLES, POSTERS, GENRES, NAMES, COUNTRIES, EMOJIS} from '../const';

const DESCRIPTION_MAX_LENGTH = 5;
const COMMENT_MAX_LENGTH = 3;
const FilmDuration = {
  MIN: 60,
  MAX: 180,
};
const CommentsCount = {
  MIN: 0,
  MAX: 5
};
const Rating = {
  MIN: 0,
  MAX: 9,
};
const AgeRating = {
  MIN: 6,
  MAX: 18,
};

const generateComment = () => {
  return {
    text: generateRandomText(COMMENT_MAX_LENGTH),
    emoji: getRandomArrayElement(EMOJIS),
    author: getRandomArrayElement(NAMES),
    date: getRandomDate(),

  };
};

const generateComments = (count) => {
  return new Array(count).fill().map(generateComment);
};

const generateFilm = () => {
  const {MIN: minDuration, MAX: maxDuration} = FilmDuration;
  const {MIN: minComments, MAX: maxComments} = CommentsCount;
  const {MIN: minRating, MAX: maxRating} = Rating;
  const {MIN: minAgeRating, MAX: maxAgeRating} = AgeRating;
  const commentsCount = getRandomInteger(minComments, maxComments);
  const rating = (getRandomInteger(minRating, maxRating) + Math.random()).toFixed(1);

  return {
    title: getRandomArrayElement(TITLES),
    poster: getRandomArrayElement(POSTERS),
    description: generateRandomText(DESCRIPTION_MAX_LENGTH),
    rating,
    ageRating: getRandomInteger(minAgeRating, maxAgeRating),
    date: getRandomDate(),
    duration: getRandomInteger(minDuration, maxDuration),
    genres: getRandomLengthArray(GENRES),
    director: getRandomArrayElement(NAMES),
    actors: getRandomLengthArray(NAMES),
    writers: getRandomLengthArray(NAMES),
    country: getRandomArrayElement(COUNTRIES),
    comments: generateComments(commentsCount),
  };
};

const generateFilms = (count) => {
  return new Array(count).fill().map(generateFilm);
};

export {generateFilms};
