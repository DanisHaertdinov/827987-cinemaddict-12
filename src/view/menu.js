import {capitalize, createElement} from '../util';

const createMenuFiltersTemplate = (filters) => {
  return filters.map((filter) => {
    const {name, filteredFilms} = filter;
    const filterCount = (filteredFilms.length > 5) ?
      `` :
      `<span class="main-navigation__item-count">${filteredFilms.length}</span>`;

    return `<a href="#${name}" class="main-navigation__item">
              ${capitalize(name)}
              ${filterCount}
            </a>`;
  }).join(``);
};

const createMenuTemplate = (filters) => {
  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${createMenuFiltersTemplate(filters)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

export default class Menu {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
