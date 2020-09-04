import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const ACTIVE_BUTTON_CLASS = `sort__button--active`;

const createSortTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button ${ACTIVE_BUTTON_CLASS}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortBtnClickHandler = this._sortBtnClickHandler.bind(this);
  }

  _sortBtnClickHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();
      this._callback._sortBtnClick(evt.target.dataset.sortType);
      this._setActiveBtn(evt.target);
    }
  }

  _setActiveBtn(btn) {
    this.getElement().querySelector(`.${ACTIVE_BUTTON_CLASS}`).classList.remove(ACTIVE_BUTTON_CLASS);
    btn.classList.add(ACTIVE_BUTTON_CLASS);
  }

  setSortBtnClickHandler(callback) {
    this._callback._sortBtnClick = callback;
    this.getElement().addEventListener(`click`, this._sortBtnClickHandler);
  }

  getTemplate() {
    return createSortTemplate();
  }
}
