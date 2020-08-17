import {createElement} from '../util';

const createFilmsCountTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class FilmsCount {
  constructor(count = 0) {
    this._element = null;
    this._count = count;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._count);
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
