import CommentView from "../view/comment";
import {render} from "../util/render";

export default class Comment {
  constructor(commentContainer, deleteComment) {
    this._commentContainer = commentContainer;
    this._deleteComment = deleteComment;
  }

  init(comment) {
    this._comment = comment;
    this._commentComponent = new CommentView(comment);

    this._commentComponent.setDeleteBtnClickHandler(this._deleteComment);

    render(this._commentContainer, this._commentComponent);
  }
}
