import AbstractView from "./abstract.js";

const createFilmsCountTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class FilmsCount extends AbstractView {
  constructor(count = 0) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._count);
  }
}
