import AbstractView from "./abstract.js";

const createUserRateTemplate = (rate) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rate}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRate extends AbstractView {
  constructor(rate) {
    super();

    this._rate = rate;
  }

  getTemplate() {
    return createUserRateTemplate(this._rate);
  }
}
