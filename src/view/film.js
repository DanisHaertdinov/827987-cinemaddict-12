import {prettifyDuration} from '../util';
import AbstractView from "./abstract.js";

const createFilmTemplate = (film) => {
  const SHORT_DESCRIPTION_MAX_LENGTH = 140;

  const {title, rating, date, duration, genres, poster, description, comments} = film;

  const year = date.getFullYear();
  const shortDescription = (description.length > SHORT_DESCRIPTION_MAX_LENGTH)
    ?
    `${description.slice(0, SHORT_DESCRIPTION_MAX_LENGTH)}…`
    :
    description;

  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${prettifyDuration(duration)}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
  </article>`
  );
};

export default class Film extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }
}
