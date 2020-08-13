const rateMap = {
  0: ``,
  1: `Novice`,
  2: `Fan`,
  3: `Movie Buff`,
};

const getUserRate = (count) => {
  const rank = Math.ceil(count / 10);
  return (rateMap[rank] === undefined) ? rateMap[3] : rateMap[rank];
};

const generateUserStats = (filters) => {
  const [, history] = filters;
  return {
    rate: getUserRate(history.filteredFilms.length),
  };
};

export {generateUserStats};
