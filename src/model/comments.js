import Observer from "../util/observer";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [
      ...this._comments,
      update,
    ];

  }

  deleteComment(update) {
    this._comments = this._comments.filter((comment) => comment.id !== update.id);
  }
}
