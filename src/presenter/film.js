import FilmView from '../view/film';
import FilmDetailsView from '../view/film-details';
import {render, remove, replace} from '../util/render';
import {Keys} from '../const';

export default class Film {
  constructor(filmContainer, changeDetailsDisplay, changeData) {
    this._filmContainer = filmContainer;

    this._changeData = changeData;
    this._changeDetailsDisplay = changeDetailsDisplay;
    this._isDetailsShown = false;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._filmDetailsEscPressHandler = this._filmDetailsEscPressHandler.bind(this);
    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._hideFilmDetails = this._hideFilmDetails.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._filmComponent.setPosterClickHandler(this._showFilmDetails);
    this._filmComponent.setTitleClickHandler(this._showFilmDetails);
    this._filmComponent.setCommentsClickHandler(this._showFilmDetails);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setCloseBtnClickHandler(this._hideFilmDetails);

    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._isDetailsShown) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleWatchListClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              isInWatchList: !this._film.isInWatchList
            }
        )
    );
  }

  _filmDetailsEscPressHandler(evt) {
    if (evt.key === Keys.ESC) {
      this._hideFilmDetails();
    }
  }

  _hideFilmDetails() {
    document.body.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._filmDetailsEscPressHandler);
    this._isDetailsShown = false;
  }

  _showFilmDetails() {
    this._changeDetailsDisplay();
    document.body.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._filmDetailsEscPressHandler);
    this._isDetailsShown = true;
  }

  resetView() {
    if (this._isDetailsShown) {
      this._hideFilmDetails();
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
  }
}
