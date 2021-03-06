import FilmsSectionView from "../view/films-section";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import FilmsListView from "../view/films";
import TopRatedFilmsView from "../view/top-rated-films";
import MostCommentedFilmsView from "../view/most-commented-films";
import SortView from "../view/sort";
import FilmPresenter from "./film";
import {render, remove} from "../util/render";
import {SortType, UserAction, UpdateType, RenderPosition} from "../const";
import {filter} from "../util/filter";

const FilmsNumber = {
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

export default class FilmsSection {
  constructor(sectionContainer, filmsModel, commentsModel, filtersModel) {
    this._sectionContainer = sectionContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filtersModel = filtersModel;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._noFilmsComponent = null;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._topRatedFilmsListComponent = new TopRatedFilmsView();
    this._mostCommentedFilmsListComponent = new MostCommentedFilmsView();

    this._filmsContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._topRatedFilmsContainer = this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedFilmsContainer = this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`);

    this._renderedFilmsCount = FilmsNumber.PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._sortBtnClickHandler = this._sortBtnClickHandler.bind(this);
    this._detailsDisplayChange = this._detailsDisplayChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
    }
  }

  _handleModelEvent(updateType, update) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearFilmsSection();
        this._renderFilmsSection({renderExtraFilms: true});
        if (this._filmDetailsPresenter) {
          this._filmDetailsPresenter.updateFilmDetails(update);
        }
        break;
      case UpdateType.MAJOR:
        this._clearFilmsSection({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmsSection();
        if (this._filmDetailsPresenter) {
          this._filmDetailsPresenter.updateFilmDetails(update);
        }
        break;
    }
  }

  _renderFilms(container, films, presenter) {
    films.forEach((film) => this._renderFilm(container, film, presenter));
  }

  _getFilms() {
    const filterType = this._filtersModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort((a, b) => b.date - a.date);
      case SortType.RATING:
        return filteredFilms.sort((a, b) => b.rating - a.rating);
    }

    return filteredFilms;
  }

  _detailsDisplayChange(filmDetailsPresenter) {
    [this._filmPresenter, this._topRatedPresenter, this._mostCommentedPresenter].forEach((presenter) => {
      Object.values(presenter).forEach((film) => film.resetView());
    });

    this._filmDetailsPresenter = filmDetailsPresenter;
  }

  _showMoreButtonClickHandler() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(this._renderedFilmsCount, this._renderedFilmsCount + FilmsNumber.PER_STEP);

    this._renderFilms(this._filmsContainer, films);

    this._renderedFilmsCount += FilmsNumber.PER_STEP;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    this._showMoreButtonComponent = new ShowMoreButtonView();

    render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonClickHandler);
  }

  _renderFilm(container, film, presenter = this._filmPresenter) {
    const filmPresenter = new FilmPresenter(container, this._detailsDisplayChange, this._handleViewAction, this._filmsModel, this._commentsModel);
    presenter[film.id] = filmPresenter;
    filmPresenter.init(film);
  }

  _renderMostCommentedFilmsList() {
    this._removePresenterFilms(this._mostCommentedPresenter);
    this._mostCommentedPresenter = {};

    const mostCommentedFilms =
    this._filmsModel.getFilms().slice()
    .sort((a, b) => {
      return b.comments.length - a.comments.length;
    })
    .slice(0, FilmsNumber.EXTRA);

    this._renderFilms(this._mostCommentedFilmsContainer, mostCommentedFilms, this._mostCommentedPresenter);
  }

  _renderTopRatedFilmsList() {
    this._removePresenterFilms(this._topRatedPresenter);
    this._topRatedPresenter = {};

    const topRatedFilms =
    this._filmsModel.getFilms().slice()
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .slice(0, FilmsNumber.EXTRA);

    this._renderFilms(this._topRatedFilmsContainer, topRatedFilms, this._topRatedPresenter);
  }

  _renderFilmsList() {
    const filmsCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilms(this._filmsContainer, films, this._filmPresenter);


    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView();

    render(this._filmsContainer, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilmsSection({renderExtraFilms = false} = {}) {
    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    render(this._sectionContainer, this._filmsSectionComponent);
    this._renderFilmsList();

    if (renderExtraFilms) {
      this._renderTopRatedFilmsList();
      this._renderMostCommentedFilmsList();
    }
  }

  _clearFilmsSection({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;
    this._removePresenterFilms(this._filmPresenter);
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FilmsNumber.PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
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
    this._currentSortType = sortType;
    this._clearFilmsSection({resetRenderedFilmsCount: true});
    this._renderFilmsSection();
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setSortBtnClickHandler(this._sortBtnClickHandler);
    render(this._sectionContainer, this._sortComponent);
  }

  init() {
    this._renderFilmsSection({renderExtraFilms: true});
    render(this._filmsSectionComponent, this._filmsListComponent);
    render(this._filmsSectionComponent, this._topRatedFilmsListComponent);
    render(this._filmsSectionComponent, this._mostCommentedFilmsListComponent);
  }

}
