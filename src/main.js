import UserRate from "./view/user-rate";
import Menu from "./view/menu";
import Sort from "./view/sort";
import FilmsCount from "./view/films-count";
import FilmsSectionPresenter from './presenter/films-section';
import {generateFilms} from "./mock/film";
import {generateFilters} from "./mock/filter";
import {generateUserStats} from "./mock/user";
import {render} from './util/render';

const FilmsNumber = {
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

const films = generateFilms(FilmsNumber.DEFAULT);
const filters = generateFilters(films);
const userStats = generateUserStats(filters);

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);

render(siteHeaderElement, new UserRate(userStats.rate).getElement());

const siteMainElement = siteBodyElement.querySelector(`.main`);

render(siteMainElement, new Menu(filters).getElement());
render(siteMainElement, new Sort().getElement());

const filmsSectionPresenter = new FilmsSectionPresenter(siteMainElement);
filmsSectionPresenter.init(films);

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new FilmsCount(films.length).getElement());

