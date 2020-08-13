import {filterFilms} from '../util';

const filmsFilterMap = {
  watchlist: `isInWatchList`,
  history: `isWatched`,
  favorites: `isFavorite`
};

const generateFilter = (films) => {
  return Object.entries(filmsFilterMap).map(([filterName, criteria]) => {
    return {
      name: filterName,
      filteredFilms: filterFilms(films, criteria),
    };
  });
};

export {generateFilter};
