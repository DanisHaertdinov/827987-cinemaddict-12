import {cutText} from '../util';

export const createFilmTemplate = (film) => {

  const {title, rating, date, duration, genres, poster, description, comments} = film;

  const year = date.getFullYear();
  const hour = Math.floor(duration / 60);
  const minutes = Math.ceil(duration % 60);
  const shortDescription = (description.length > 140) ? `${cutText(description, 0, 140)}…` : description;

  return (
    `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${hour}h ${minutes}m</span>
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
