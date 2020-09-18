import AbstractView from "./abstract.js";

const ACTIVE_FILTER_CLASS = `main-navigation__item--active`;

const createFiltersTemplate = (filters, currentFilterType) => {
  return (
    `<div class="main-navigation__items">
      ${filters.map((filter) => {
      const {name, type, count} = filter;
      const filterClass = (currentFilterType === type) ? ACTIVE_FILTER_CLASS : ``;

      const filterCountElement = !(type === `all` && count > 5) ? `<span class="main-navigation__item-count">${count}</span>` : ``;

      return `<a href="#${type}" data-filter="${type}" class="main-navigation__item ${filterClass}">
                  ${name}
                  ${filterCountElement}
                </a>`;
    }).join(``)}
    </div>`
  );
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._currentFilterType = currentFilterType;
    this._filters = filters;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.filter);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
