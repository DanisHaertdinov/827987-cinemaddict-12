import UserRatePresenter from "./presenter/user-rate";
import MenuView from "./view/menu";
import FilmsCountView from "./view/films-count";
import FilmsSectionPresenter from './presenter/films-section';
import FiltersPresenter from "./presenter/filters";
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import FiltersModel from "./model/filter.js";
import {generateFilms, generateComments} from "./mock/film";
import {render} from './util/render';

const FilmsNumber = {
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

const films = generateFilms(FilmsNumber.DEFAULT);
const comments = generateComments(films);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filtersModel = new FiltersModel();

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);

const userRatePresenter = new UserRatePresenter(siteHeaderElement, filmsModel);
userRatePresenter.init();

const siteMainElement = siteBodyElement.querySelector(`.main`);
const menuComponent = new MenuView();

render(siteMainElement, menuComponent);

const filmsSectionPresenter = new FilmsSectionPresenter(siteMainElement, filmsModel, commentsModel, filtersModel);
filmsSectionPresenter.init();

const filtersPresenter = new FiltersPresenter(menuComponent, filtersModel, filmsModel);
filtersPresenter.init();

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new FilmsCountView(films.length).getElement());

