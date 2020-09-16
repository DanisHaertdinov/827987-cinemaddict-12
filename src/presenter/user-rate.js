import {render, replace, remove} from "../util/render.js";
import UserRateView from "../view/user-rate";
import {filter} from "../util/filter.js";
import {filmsFilterMap, rateMap} from "../const.js";

export default class UserRate {
  constructor(userRateContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._currentFilter = null;
    this._userRateContainer = userRateContainer;
    this._userRateComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);


    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._generateUserRate();
    const prevUserRateComponent = this._userRateComponent;

    this._userRateComponent = new UserRateView(this._userRate);

    if (prevUserRateComponent === null) {
      render(this._userRateContainer, this._userRateComponent);
      return;
    }

    replace(this._userRateComponent, prevUserRateComponent);
    remove(prevUserRateComponent);
  }

  _generateUserRate() {
    const films = this._filmsModel.getFilms();
    const count = filter[filmsFilterMap.HISTORY](films).length;
    const rank = Math.ceil(count / 10);
    this._userRate = (rateMap[rank] === undefined) ? rateMap[3] : rateMap[rank];
  }

  _handleModelEvent() {
    this.init();
  }
}
