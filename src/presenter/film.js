import FilmView from '../view/film';
import FilmDetailsView from '../view/film-details';
import CommentPresenter from './comment';
import {render, remove} from '../util/render';
import {Keys, UserAction, UpdateType, NAMES} from '../const';
import {generateId, getRandomArrayElement} from '../util/common';

export default class Film {
  constructor(filmContainer, changeDetailsDisplay, changeData, filmsModel, commentsModel) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeDetailsDisplay = changeDetailsDisplay;
    this._isDetailsShown = false;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._filmDetailsEscPressHandler = this._filmDetailsEscPressHandler.bind(this);
    this._showFilmDetails = this._showFilmDetails.bind(this);
    this._hideFilmDetails = this._hideFilmDetails.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._renderComments = this._renderComments.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmComponent = new FilmView(film);

    this._filmComponent.setPosterClickHandler(this._showFilmDetails);
    this._filmComponent.setTitleClickHandler(this._showFilmDetails);
    this._filmComponent.setCommentsClickHandler(this._showFilmDetails);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);

    render(this._filmContainer, this._filmComponent);
  }

  _destroyFilmDetailsComponent() {
    remove(this._filmDetailsComponent);
    this._filmDetailsComponent = null;
  }

  _renderFilmDetailsComponent() {
    this._filmDetailsComponent = new FilmDetailsView(this._film);
    this._filmDetailsComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmDetailsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsComponent.setCloseBtnClickHandler(this._hideFilmDetails);
    this._filmDetailsComponent.setElementUpdateHandler(this._renderComments);
    this._filmDetailsComponent.setInputKeydownHandler(this._handleAddComment);
    this._renderComments();
  }

  updateFilmDetails(film) {
    if (this._film.id !== film.id || this._filmDetailsComponent === null) {
      return;
    }

    this._film = film;
    this._filmDetailsComponent.updateData(FilmDetailsView.parseDataToFilm(this._film));
  }

  _getComments() {
    return this._commentsModel.getComments().filter((comment) => this._film.comments.includes(comment.id));
  }

  _renderComment(container, comment) {
    const commentPresenter = new CommentPresenter(container, this._handleCommentDelete);
    commentPresenter.init(comment);
  }

  _renderComments() {
    const container = this._filmDetailsComponent.getCommentsContainer();
    this._getComments().forEach((comment) => this._renderComment(container, comment));
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleWatchListClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isInWatchList: !this._film.isInWatchList
            }
        )
    );
  }

  _filmDetailsEscPressHandler(evt) {
    if (evt.key === Keys.ESC) {
      this._hideFilmDetails();
    }
  }

  _hideFilmDetails() {
    document.body.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._filmDetailsEscPressHandler);
    this._isDetailsShown = false;
    this._destroyFilmDetailsComponent();
  }

  _showFilmDetails() {
    this._renderFilmDetailsComponent();
    this._changeDetailsDisplay(this);
    document.body.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._filmDetailsEscPressHandler);
    this._isDetailsShown = true;
  }

  resetView() {
    if (this._isDetailsShown) {
      this._hideFilmDetails();
    }
  }

  _handleCommentDelete(comment) {
    this._commentsModel.deleteComment(comment);
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              comments: this._film.comments.filter((filmComment) => filmComment !== comment.id)
            }
        )
    );
  }

  _handleAddComment(comment) {
    const newComment = Object.assign({}, comment, {
      id: generateId(),
      author: getRandomArrayElement(NAMES),
      date: new Date(),
    });
    this._filmDetailsComponent.reset();
    this._commentsModel.addComment(newComment);
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign({},
            this._film,
            {
              comments: [...this._film.comments, newComment.id],
            }
        )
    );
  }

  destroy() {
    remove(this._filmComponent);
  }
}
