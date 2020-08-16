import {createElement} from "../util";

const createUserRateTemplate = (rate) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rate}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRate {
  constructor(rate) {
    this._element = null;
    this._rate = rate;
  }

  getTemplate() {
    return createUserRateTemplate(this._rate);
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
