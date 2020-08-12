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
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

const films = generateFilms(FilmsCount.DEFAULT);
console.log(films)
const topRatedFilms = films.slice().sort((a, b) => {
  return b.rating - a.rating;
}).slice(0, FilmsCount.EXTRA);

const mostCommentedFilms = films.slice().sort((a, b) => {
  return b.comments.length - a.comments.length;
}).slice(0, FilmsCount.EXTRA);


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
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

films.slice(1, FilmsCount.PER_STEP + 1).forEach((film) => {
  render(filmsWrapperElement, createFilmTemplate(film));
});

if (films.length > FilmsCount.PER_STEP) {
  let renderedFilmsCount = FilmsCount.PER_STEP;

  render(filmsListElement, createShowMoreButtonTemplate());

  const showMoreButtonElement = filmsListElement.querySelector(`.films-list__show-more`);

  showMoreButtonElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmsCount, renderedFilmsCount + FilmsCount.PER_STEP).forEach((film) => {
      render(filmsWrapperElement, createFilmTemplate(film));
    });

    renderedFilmsCount += FilmsCount.PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButtonElement.remove();
    }
  });
}

const extraFilmsWrapperElements = siteMainElement.querySelectorAll(`.films-list--extra .films-list__container`);

for (const wrapper of extraFilmsWrapperElements) {
  if (wrapper === extraFilmsWrapperElements[0]) {
    for (const film of topRatedFilms) {
      render(wrapper, createFilmTemplate(film));
    }
  } else {
    for (const film of mostCommentedFilms) {
      render(wrapper, createFilmTemplate(film));
    }
  }
}

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, createFilmsCountTemplate(films.length));
// render(siteBodyElement, createFilmDetailsTemplate(films[0]));
