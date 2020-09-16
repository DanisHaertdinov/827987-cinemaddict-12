import FiltersView from "../view/filters.js";
import {render, replace, remove} from "../util/render.js";
import {UpdateType, filmsFilterMap, RenderPosition} from "../const.js";
import {filter} from "../util/filter";

export default class Filter {
  constructor(filterContainer, filtersModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filtersModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: filmsFilterMap.ALL,
        name: `All Movies`,
        count: filter[filmsFilterMap.ALL](films).length
      },
      {
        type: filmsFilterMap.WATCHLIST,
        name: `Watchlist`,
        count: filter[filmsFilterMap.WATCHLIST](films).length
      },
      {
        type: filmsFilterMap.HISTORY,
        name: `History`,
        count: filter[filmsFilterMap.HISTORY](films).length
      },
      {
        type: filmsFilterMap.FAVORITES,
        name: `Favorites`,
        count: filter[filmsFilterMap.FAVORITES](films).length
      },
    ];
  }
}
