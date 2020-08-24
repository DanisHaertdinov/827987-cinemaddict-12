import FilmsSectionView from "../view/films-section";
import NoFilmsView from "../view/no-films";
import ShowMoreButtonView from "../view/show-more-button";
import FilmsListView from "../view/films";
import TopRatedFilmsView from "../view/top-rated-films";
import MostCommentedFilmsView from "../view/most-commented-films";
import FilmView from "../view/film";
import FilmDetailsView from "../view/film-details";
import {render, remove} from "../util/render";
import {Keys} from "../const";

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

    this._filmsContainer = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._topRatedFilmsContainer = this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedFilmsContainer = this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`);

    this._renderedFilmsCount = FilmsNumber.PER_STEP;

    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
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

  _renderFilm(container, film) {
    const filmComponent = new FilmView(film);
    const filmDetailsComponent = new FilmDetailsView(film);

    const filmDetailsEscPressHandler = (evt) => {
      if (evt.key === Keys) {
        hideFilmDetails();
      }
    };

    const showFilmDetails = () => {
      document.body.appendChild(filmDetailsComponent.getElement());
      document.addEventListener(`keydown`, filmDetailsEscPressHandler);
    };

    const hideFilmDetails = () => {
      document.body.removeChild(filmDetailsComponent.getElement());
      document.removeEventListener(`keydown`, filmDetailsEscPressHandler);
    };

    filmComponent.setPosterClickHandler(showFilmDetails);
    filmComponent.setTitleClickHandler(showFilmDetails);
    filmComponent.setCommentsClickHandler(showFilmDetails);
    filmDetailsComponent.setCloseBtnClickHandler(hideFilmDetails);

    render(container, filmComponent);
  }

  _renderMostCommentedFilmsList() {
    render(this._filmsSectionComponent, this._mostCommentedFilmsListComponent);

    this._sectionFilms
    .slice()
    .sort((a, b) => {
      return b.comments.length - a.comments.length;
    })
    .slice(0, FilmsNumber.EXTRA)
    .forEach((film) => this._renderFilm(this._mostCommentedFilmsContainer, film));
  }

  _renderTopRatedFilmsList() {
    render(this._filmsSectionComponent, this._topRatedFilmsListComponent);

    this._sectionFilms
    .slice()
    .sort((a, b) => {
      return b.rating - a.rating;
    })
    .slice(0, FilmsNumber.EXTRA)
    .forEach((film) => this._renderFilm(this._topRatedFilmsContainer, film));
  }

  _renderFilmsList() {
    render(this._filmsSectionComponent, this._filmsListComponent);

    this._sectionFilms
    .slice(0, Math.min(this._sectionFilms.length, FilmsNumber.PER_STEP))
    .forEach((film) => this._renderFilm(this._filmsContainer, film));

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

  init(films) {
    this._sectionFilms = films.slice();

    render(this._sectionContainer, this._filmsSectionComponent);
    this._renderFilmsSection();
    this._renderTopRatedFilmsList();
    this._renderMostCommentedFilmsList();
  }

}


// const renderFilmsSection = (sectionContainer, sectionFilms) => {
//   const filmsSectionComponent = new FilmsSection();
//   const noFilmsComponent = new NoFilms();
//   render(sectionContainer, filmsSectionElement);
//   if (sectionFilms.length === 0) {
//     render(filmsSectionElement, noFilmsComponent.getElement());
//     return;
//   }

//   const filmsComponent = new Films();
//   const topRatedFilmsComponent = new TopRatedFilms();
//   const mostCommentedFilmsComponent = new MostCommentedFilms();

//   const filmsElement = filmsComponent.getElement();
//   const filmsWrapperElement = filmsElement.querySelector(`.films-list__container`);

//   const topRatedFilmsElement = topRatedFilmsComponent.getElement();
//   const topRatedFilmsWrapperElement = topRatedFilmsElement.querySelector(`.films-list__container`);

//   const mostCommentedFilmsElement = mostCommentedFilmsComponent.getElement();
//   const mostCommentedFilmsWrapperElement = mostCommentedFilmsElement.querySelector(`.films-list__container`);

//   const mostCommentedFilms = sectionFilms.slice().sort((a, b) => {
//     return b.comments.length - a.comments.length;
//   }).slice(0, FilmsNumber.EXTRA);

//   render(filmsSectionElement, filmsElement);

//   sectionFilms.slice(0, FilmsNumber.PER_STEP).forEach((film) => {
//     renderFilm(filmsWrapperElement, film);
//   });

//   if (sectionFilms.length > FilmsNumber.PER_STEP) {
//     let renderedFilmsCount = FilmsNumber.PER_STEP;

//     const showMoreButtonComponent = new ShowMoreButton();

//     render(filmsElement, showMoreButtonComponent.getElement());


//     showMoreButtonComponent.setClickHandler(() => {
//       sectionFilms.slice(renderedFilmsCount, renderedFilmsCount + FilmsNumber.PER_STEP).forEach((film) => {
//         renderFilm(filmsWrapperElement, film);
//       });

//       renderedFilmsCount += FilmsNumber.PER_STEP;

//       if (renderedFilmsCount >= films.length) {
//         showMoreButtonComponent.getElement().remove();
//         showMoreButtonComponent.removeElement();
//       }
//     });
//   }

//   render(filmsSectionElement, topRatedFilmsElement);
//   topRatedFilms.slice(0, FilmsNumber.EXTRA).forEach((film) => {
//     renderFilm(topRatedFilmsWrapperElement, film);
//   });

//   render(filmsSectionElement, mostCommentedFilmsElement);
//   mostCommentedFilms.slice(0, FilmsNumber.EXTRA).forEach((film) => {
//     renderFilm(mostCommentedFilmsWrapperElement, film);
//   });
// };
