import FilmsSectionView from "../view/films-section";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import FilmsListView from "../view/films";
import TopRatedFilmsView from "../view/top-rated-films";
import MostCommentedFilmsView from "../view/most-commented-films";
import SortView from "../view/sort";
import FilmPresenter from "./film";
import {render, remove} from "../util/render";
import {SortType} from "../const";
import {updateItem} from "../util/common";

const FilmsNumber = {
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

export default class FilmsSection {
  constructor(sectionContainer) {
    this._sectionContainer = sectionContainer;

    this._filmsSectionComponent = new FilmsSectionView();
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListComponent = new FilmsListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._topRatedFilmsListComponent = new TopRatedFilmsView();
    this._mostCommentedFilmsListComponent = new MostCommentedFilmsView();
    this._sortComponent = new SortView();

    this._filmsContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._topRatedFilmsContainer = this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedFilmsContainer = this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`);

    this._renderedFilmsCount = FilmsNumber.PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._filmChangeHandler = this._filmChangeHandler.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._sortBtnClickHandler = this._sortBtnClickHandler.bind(this);
    this._detailsDisplayChange = this._detailsDisplayChange.bind(this);
  }

  _filmChangeHandler(updatedFilm) {
    this._sectionFilms = updateItem(this._sectionFilms, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    if (this._filmPresenter[updatedFilm.id]) {
      this._filmPresenter[updatedFilm.id].init(updatedFilm);
    }
    if (this._topRatedPresenter[updatedFilm.id]) {
      this._topRatedPresenter[updatedFilm.id].init(updatedFilm);
    }
    if (this._mostCommentedPresenter[updatedFilm.id]) {
      this._mostCommentedPresenter[updatedFilm.id].init(updatedFilm);
    }
  }

  _detailsDisplayChange() {
    [this._filmPresenter, this._topRatedPresenter, this._mostCommentedPresenter].forEach((presenter) => {
      Object.values(presenter).forEach((film) => film.resetView());
    });
  }

  _showMoreButtonClickHandler() {
    this._sectionFilms
    .slice(this._renderedFilmsCount, this._renderedFilmsCount + FilmsNumber.PER_STEP)
    .forEach((film) => this._renderFilm(this._filmsContainer, film));

    this._renderedFilmsCount += FilmsNumber.PER_STEP;

    if (this._renderedFilmsCount >= this._sectionFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonClickHandler);
  }

  _renderFilm(container, film, presenter = this._filmPresenter) {
    const filmPresenter = new FilmPresenter(container, this._detailsDisplayChange, this._filmChangeHandler);
    presenter[film.id] = filmPresenter;
    filmPresenter.init(film);
  }

  _renderMostCommentedFilmsList() {
    this._removePresenterFilms(this._mostCommentedPresenter);
    this._mostCommentedPresenter = {};

    this._sectionFilms
    .slice()
    .sort((a, b) => {
      return b.comments.length - a.comments.length;
    })
    .slice(0, FilmsNumber.EXTRA)
    .forEach((film) => this._renderFilm(this._mostCommentedFilmsContainer, film, this._mostCommentedPresenter));
  }

  _renderTopRatedFilmsList() {
    this._removePresenterFilms(this._topRatedPresenter);
    this._topRatedPresenter = {};

    this._sectionFilms
    .slice()
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .slice(0, FilmsNumber.EXTRA)
    .forEach((film) => this._renderFilm(this._topRatedFilmsContainer, film, this._topRatedPresenter));
  }

  _renderFilmsList() {
    this._removePresenterFilms(this._filmPresenter);
    this._filmPresenter = {};

    this._sectionFilms
    .slice(0, Math.min(this._sectionFilms.length, FilmsNumber.PER_STEP))
    .forEach((film) => this._renderFilm(this._filmsContainer, film));

    this._renderedFilmsCount = FilmsNumber.PER_STEP;

    if (this._sectionFilms.length > FilmsNumber.PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderNoFilms() {
    render(this._sectionContainer, this._noFilmsComponent);
  }

  _renderFilmsSection() {
    if (this._sectionFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsList();
  }

  _sortFilms(sortType) {
    this._currentSortType = sortType;

    switch (sortType) {
      case SortType.DATE:
        this._sectionFilms.sort((a, b) => b.date - a.date);
        break;
      case SortType.RATING:
        this._sectionFilms.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this._sectionFilms = this._sourcedFilms.slice();

    }
  }

  _removePresenterFilms(presenter) {
    Object.values(presenter).forEach((film) => {
      film.destroy();
    });
  }

  _sortBtnClickHandler(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._sortFilms(sortType);
    this._renderFilmsList();
  }

  _renderSort() {
    this._sortComponent.setSortBtnClickHandler(this._sortBtnClickHandler);
    render(this._sectionContainer, this._sortComponent);
  }

  init(films) {
    this._sectionFilms = films.slice();
    this._sourcedFilms = films.slice();

    this._renderSort();
    render(this._sectionContainer, this._filmsSectionComponent);
    render(this._filmsSectionComponent, this._filmsListComponent);
    render(this._filmsSectionComponent, this._mostCommentedFilmsListComponent);
    render(this._filmsSectionComponent, this._topRatedFilmsListComponent);
    this._renderFilmsSection();
    this._renderTopRatedFilmsList();
    this._renderMostCommentedFilmsList();
  }

}
