import UserRateView from "./view/user-rate";
import MenuView from "./view/menu";
import FilmsCountView from "./view/films-count";
import FilmsSectionPresenter from './presenter/films-section';
import FilmsModel from "./model/films";
import CommentsModel from "./model/comments";
import {generateFilms, generateComments} from "./mock/film";
import {generateFilters} from "./mock/filter";
import {generateUserStats} from "./mock/user";
import {render} from './util/render';


const FilmsNumber = {
  DEFAULT: 22,
  EXTRA: 2,
  PER_STEP: 5,
};

const films = generateFilms(FilmsNumber.DEFAULT);
const comments = generateComments(films);
const filters = generateFilters(films);
const userStats = generateUserStats(filters);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);

render(siteHeaderElement, new UserRateView(userStats.rate).getElement());

const siteMainElement = siteBodyElement.querySelector(`.main`);

render(siteMainElement, new MenuView(filters).getElement());

const filmsSectionPresenter = new FilmsSectionPresenter(siteMainElement, filmsModel, commentsModel);
filmsSectionPresenter.init();

const footerStatisticsElement = siteBodyElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, new FilmsCountView(films.length).getElement());

