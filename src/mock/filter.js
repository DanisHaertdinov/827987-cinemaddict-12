import {filterByProperty} from '../util';

const filmsFilterMap = {
  watchlist: `isInWatchList`,
  history: `isWatched`,
  favorites: `isFavorite`
};

const generateFilters = (films) => {
  return Object.entries(filmsFilterMap).map(([filterName, criteria]) => {
    return {
      name: filterName,
      filteredFilms: filterByProperty(films, criteria),
    };
  });
};

export {generateFilters};
