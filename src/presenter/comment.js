import CommentView from "../view/comment";
import {render} from "../util/render";

export default class Comment {
  constructor(commentContainer) {
    this._commentContainer = commentContainer;
  }

  init(comment) {
    this._comment = comment;
    this._commentComponent = new CommentView(comment);
    render(this._commentContainer, this._commentComponent);
  }
}
