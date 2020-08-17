import UserRate from "./view/user-rate";
import Menu from "./view/menu";
import Sort from "./view/sort";
import FilmsSection from "./view/films-section";
import Film from "./view/film";
import ShowMoreButton from "./view/show-more-button";
import FilmsCount from "./view/films-count";
import FilmDetails from "./view/film-details";
import Films from "./view/films";
import TopRatedFilms from "./view/top-rated-films";
import MostCommentedFilms from "./view/most-commented-films";
import {generateFilms} from "./mock/film";
import {generateFilters} from "./mock/filter";
import {generateUserStats} from "./mock/user";
import {render} from './util';
import {Keys} from "./const";

const FilmsNumber = {
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

const films = generateFilms(FilmsNumber.DEFAULT);
const filters = generateFilters(films);
const userStats = generateUserStats(filters);

const renderFilm = (filmsWrapperElement, film) => {
  const filmComponent = new Film(film);
  const filmElement = filmComponent.getElement();

  const filmDetailsComponent = new FilmDetails(film);

  const filmDetailsClose = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  const filmDetailsCloseClickHandler = () => {
    hideFilmDetails();
  };

  const filmDetailsEscPressHandler = (evt) => {
    if (evt.key === Keys.ESC) {
      hideFilmDetails();
    }
  };

  const showFilmDetails = () => {
    render(siteBodyElement, filmDetailsComponent.getElement());
    filmDetailsClose.addEventListener(`click`, filmDetailsCloseClickHandler);
    document.addEventListener(`keydown`, filmDetailsEscPressHandler);
  };

  const hideFilmDetails = () => {
    filmDetailsClose.removeEventListener(`click`, filmDetailsCloseClickHandler);
    document.removeEventListener(`keydown`, filmDetailsEscPressHandler);
    filmDetailsComponent.getElement().remove();
  };

  filmElement.querySelector(`.film-card__title`).addEventListener(`click`, showFilmDetails);
  filmElement.querySelector(`.film-card__poster`).addEventListener(`click`, showFilmDetails);
  filmElement.querySelector(`.film-card__comments`).addEventListener(`click`, showFilmDetails);


  render(filmsWrapperElement, filmElement);
};

const renderFilmsSection = (sectionContainer, sectionFilms) => {
  const filmsSectionComponent = new FilmsSection();
  const filmsComponent = new Films();
  const topRatedFilmsComponent = new TopRatedFilms();
  const mostCommentedFilmsComponent = new MostCommentedFilms();

  const filmsSectionElement = filmsSectionComponent.getElement();
  const filmsElement = filmsComponent.getElement();
  const filmsWrapperElement = filmsElement.querySelector(`.films-list__container`);

  const topRatedFilmsElement = topRatedFilmsComponent.getElement();
  const topRatedFilmsWrapperElement = topRatedFilmsElement.querySelector(`.films-list__container`);

  const mostCommentedFilmsElement = mostCommentedFilmsComponent.getElement();
  const mostCommentedFilmsWrapperElement = mostCommentedFilmsElement.querySelector(`.films-list__container`);

  const topRatedFilms = sectionFilms.slice().sort((a, b) => {
    return b.rating - a.rating;
  }).slice(0, FilmsNumber.EXTRA);

  const mostCommentedFilms = sectionFilms.slice().sort((a, b) => {
    return b.comments.length - a.comments.length;
  }).slice(0, FilmsNumber.EXTRA);

  render(sectionContainer, filmsSectionElement);
  render(filmsSectionElement, filmsElement);

  sectionFilms.slice(0, FilmsNumber.PER_STEP).forEach((film) => {
    renderFilm(filmsWrapperElement, film);
  });

  if (sectionFilms.length > FilmsNumber.PER_STEP) {
    let renderedFilmsCount = FilmsNumber.PER_STEP;

    const showMoreButtonComponent = new ShowMoreButton();

    render(filmsElement, showMoreButtonComponent.getElement());


    showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      sectionFilms.slice(renderedFilmsCount, renderedFilmsCount + FilmsNumber.PER_STEP).forEach((film) => {
        renderFilm(filmsWrapperElement, film);
      });

      renderedFilmsCount += FilmsNumber.PER_STEP;

      if (renderedFilmsCount >= films.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }

  render(filmsSectionElement, topRatedFilmsElement);
  topRatedFilms.slice(0, FilmsNumber.EXTRA).forEach((film) => {
    renderFilm(topRatedFilmsWrapperElement, film);
  });

  render(filmsSectionElement, mostCommentedFilmsElement);
  mostCommentedFilms.slice(0, FilmsNumber.EXTRA).forEach((film) => {
    renderFilm(mostCommentedFilmsWrapperElement, film);
  });
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);

render(siteHeaderElement, new UserRate(userStats.rate).getElement());

const siteMainElement = siteBodyElement.querySelector(`.main`);

render(siteMainElement, new Menu(filters).getElement());
render(siteMainElement, new Sort().getElement());

renderFilmsSection(siteMainElement, films);

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new FilmsCount(films.length).getElement());

