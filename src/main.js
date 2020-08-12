import {createUserRateTemplate} from "./view/user-rate";
import {createMenuTemplate} from "./view/menu";
import {createSortTemplate} from "./view/sort";
import {createFilmsSectionTemplate} from "./view/films-section";
import {createFilmTemplate} from "./view/film";
import {createShowMoreButtonTemplate} from "./view/show-more-button";
import {createFilmsCountTemplate} from "./view/films-count";
import {createFilmDetailsTemplate} from "./view/film-details";
import {generateFilms} from "./mock/film";

const FilmsCount = {
  DEFAULT: 10,
  EXTRA: 2,
};

const films = generateFilms(FilmsCount.DEFAULT);

const render = (container, template, place = `beforeend`, count = 1) => {
  for (let i = 0; i < count; i++) {
    container.insertAdjacentHTML(place, template);
  }
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);

render(siteHeaderElement, createUserRateTemplate());

const siteMainElement = siteBodyElement.querySelector(`.main`);

render(siteMainElement, createMenuTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsSectionTemplate());

const filmsListElement = siteMainElement.querySelector(`.films-list`);
const filmsWrapperElement = filmsListElement.querySelector(`.films-list__container`);

for (const film of films) {
  render(filmsWrapperElement, createFilmTemplate(film));
}

render(filmsListElement, createShowMoreButtonTemplate());

const extraFilmsWrapperElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);

// for (const wrapper of extraFilmsWrapperElements) {
//   render(wrapper, createFilmTemplate(), `beforeend`, FilmsCount.EXTRA);
// }

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, createFilmsCountTemplate());
render(siteBodyElement, createFilmDetailsTemplate(films[0]));
