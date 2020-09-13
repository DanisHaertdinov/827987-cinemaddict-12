import {prettifyDuration, formatDate} from "../util/common";
import Smart from "./smart";
import {EMOJIS} from "../const";

const createFilmDetailsEmojiList = (userEmoji) => {
  return EMOJIS.map((emoji) => {
    const emojiState = (userEmoji === emoji) ? `checked` : ``;

    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${emojiState}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`;
  }).join(``);
};

const createFilmDetailsUserEmojiTemplate = (userEmoji) => {
  return userEmoji ? `<img src="./images/emoji/${userEmoji}.png" width="55" height="55" alt="emoji">` : ``;
};

const createFilmDetailsGenresTemplate = (genres) => {
  return genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(``);
};

const createFilmDetailsTemplate = (film) => {
  const {
    title,
    description,
    poster,
    ageRating,
    rating,
    director,
    writers,
    actors,
    date,
    duration,
    country,
    genres,
    comments,
    isInWatchList,
    isWatched,
    isFavorite,
    userEmoji,
    userComment,
  } = film;

  const releaseDate = formatDate(date, `DD MMMM YYYY`);

  const genresTitle = (genres.length > 1) ? `Genres` : `Genre`;

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${prettifyDuration(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresTitle}</td>
              <td class="film-details__cell">
                ${createFilmDetailsGenresTemplate(genres)}
            </tr>
          </table>

          <p class="film-details__film-description">
             ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchList ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
        
        </ul>

        <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">
          ${createFilmDetailsUserEmojiTemplate(userEmoji)}
        </div>
          
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${userComment}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createFilmDetailsEmojiList(userEmoji)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmDetails extends Smart {
  constructor(film) {
    super();

    this._film = film;
    this._data = FilmDetails.parseFilmToData(film);
    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._elementUpdateHandler = this._elementUpdateHandler.bind(this);

    this.getCommentsContainer = this.getCommentsContainer.bind(this);

    this._setInnerHandlers();
  }

  getCommentsContainer() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  reset() {
    this.updateData(FilmDetails.parseFilmToData(this._film));
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setElementUpdateHandler(this._callback.elementUpdated);
  }

  updateElement() {
    const scrollPosition = this.getElement().scrollTop;
    super.updateElement();
    this._elementUpdateHandler();
    this.getElement().scrollTop = scrollPosition;
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      userEmoji: null,
      userComment: ``,
    });
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.userEmoji;
    delete data.userComment;

    return data;
  }

  _elementUpdateHandler() {
    this._callback.elementUpdated();
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      userComment: evt.target.value
    }, true);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      userEmoji: evt.target.value
    });
  }

  _closeBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  setElementUpdateHandler(callback) {
    this._callback.elementUpdated = callback;
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchListClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeBtnClickHandler);
  }
}
