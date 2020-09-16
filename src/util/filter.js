import {filterByProperty} from "./common";
import {filmsFilterMap} from "../const";

const filter = {
  [filmsFilterMap.ALL]: (films) => films,
  [filmsFilterMap.WATCHLIST]: (films) => filterByProperty(films, `isInWatchList`),
  [filmsFilterMap.HISTORY]: (films) => filterByProperty(films, `isWatched`),
  [filmsFilterMap.FAVORITES]: (films) => filterByProperty(films, `isFavorite`),
};

export {
  filter,
};
