import UserRate from "./view/user-rate";
import Menu from "./view/menu";
import Sort from "./view/sort";
import FilmsSection from "./view/films-section";
import Film from "./view/film";
import ShowMoreButton from "./view/show-more-button";
import FilmsCount from "./view/films-count";
import FilmDetails from "./view/film-details";
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

const topRatedFilms = films.slice().sort((a, b) => {
  return b.rating - a.rating;
}).slice(0, FilmsNumber.EXTRA);

const mostCommentedFilms = films.slice().sort((a, b) => {
  return b.comments.length - a.comments.length;
}).slice(0, FilmsNumber.EXTRA);

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);

render(siteHeaderElement, new UserRate(userStats.rate).getElement());

const siteMainElement = siteBodyElement.querySelector(`.main`);

render(siteMainElement, new Menu(filters).getElement());
render(siteMainElement, new Sort().getElement());
render(siteMainElement, new FilmsSection().getElement());

const filmsListElement = siteMainElement.querySelector(`.films-list`);
const filmsWrapperElement = filmsListElement.querySelector(`.films-list__container`);

films.slice(0, FilmsNumber.PER_STEP).forEach((film) => {
  renderFilm(filmsWrapperElement, film);
});

if (films.length > FilmsNumber.PER_STEP) {
  let renderedFilmsCount = FilmsNumber.PER_STEP;

  const showMoreButtonComponent = new ShowMoreButton();

  render(filmsListElement, showMoreButtonComponent.getElement());


  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmsCount, renderedFilmsCount + FilmsNumber.PER_STEP).forEach((film) => {
      renderFilm(filmsWrapperElement, film);
    });

    renderedFilmsCount += FilmsNumber.PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const extraFilmsWrapperElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);

for (const wrapper of extraFilmsWrapperElements) {
  if (wrapper === extraFilmsWrapperElements[0]) {
    for (const film of topRatedFilms) {
      renderFilm(wrapper, film);
    }
  } else {
    for (const film of mostCommentedFilms) {
      renderFilm(wrapper, film);
    }
  }
}

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new FilmsCount(films.length).getElement());

