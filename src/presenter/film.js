import FilmView from '../view/film';
import FilmDetailsView from '../view/film-details';
import {render, remove} from '../util/render';
import {Keys} from '../const';

export default class Film {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._filmDetailsEscPressHandler = this._filmDetailsEscPressHandler.bind(this);
    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._hideFilmDetails = this._hideFilmDetails.bind(this);
  }

  init(film) {
    this._film = film;

    this._prevFilmComponent = this._filmComponent;
    this._prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmView(film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    this._filmComponent.setPosterClickHandler(this._showFilmDetails);
    this._filmComponent.setTitleClickHandler(this._showFilmDetails);
    this._filmComponent.setCommentsClickHandler(this._showFilmDetails);
    this._filmDetailsComponent.setCloseBtnClickHandler(this._hideFilmDetails);

    if (this._prevFilmComponent === null || this._prevFilmDetailsComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }
  }

  _filmDetailsEscPressHandler(evt) {
    if (evt.key === Keys.ESC) {
      this._hideFilmDetails();
    }
  }

  _hideFilmDetails() {
    document.body.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._filmDetailsEscPressHandler);
  }

  _showFilmDetails() {
    document.body.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._filmDetailsEscPressHandler);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
  }
}
