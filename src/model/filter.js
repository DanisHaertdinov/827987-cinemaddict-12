import Observer from "../util/observer.js";
import {filmsFilterMap} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = filmsFilterMap.ALL;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
