import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const ACTIVE_BUTTON_CLASS = `sort__button--active`;

const createSortTemplate = (currentSortType) => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? ACTIVE_BUTTON_CLASS : ``}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE ? ACTIVE_BUTTON_CLASS : ``}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING ? ACTIVE_BUTTON_CLASS : ``}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sort extends AbstractView {
  constructor(sortType) {
    super();

    this._sortBtnClickHandler = this._sortBtnClickHandler.bind(this);
    this._sortType = sortType;
  }

  _sortBtnClickHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();
      this._callback._sortBtnClick(evt.target.dataset.sortType);
    }
  }

  setSortBtnClickHandler(callback) {
    this._callback._sortBtnClick = callback;
    this.getElement().addEventListener(`click`, this._sortBtnClickHandler);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }
}
