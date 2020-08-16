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

const FilmsNumber = {
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

const films = generateFilms(FilmsNumber.DEFAULT);
const filters = generateFilters(films);
const userStats = generateUserStats(filters);

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
  render(filmsWrapperElement, new Film(film).getElement());
});

if (films.length > FilmsNumber.PER_STEP) {
  let renderedFilmsCount = FilmsNumber.PER_STEP;

  const showMoreButtonComponent = new ShowMoreButton();

  render(filmsListElement, showMoreButtonComponent.getElement());


  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmsCount, renderedFilmsCount + FilmsNumber.PER_STEP).forEach((film) => {
      render(filmsWrapperElement, new Film(film).getElement());
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
      render(wrapper, new Film(film).getElement());
    }
  } else {
    for (const film of mostCommentedFilms) {
      render(wrapper, new Film(film).getElement());
    }
  }
}

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new FilmsCount(films.length).getElement());
// render(siteBodyElement, createFilmDetailsTemplate(films[0]));
