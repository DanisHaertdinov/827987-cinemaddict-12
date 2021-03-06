import AbstractView from "./abstract.js";
import {humanizeDate} from "../util/common.js";

const createCommentTemplate = (comment) => {
  const {emoji, text, author, date} = comment;
  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-angry">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeDate(date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

export default class Comment extends AbstractView {
  constructor(comment) {
    super();

    this._comment = comment;

    this._deleteBtnClickHandler = this._deleteBtnClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  _deleteBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteBtnClick(this._comment);
  }

  setDeleteBtnClickHandler(callback) {
    this._callback.deleteBtnClick = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteBtnClickHandler);
  }
}
