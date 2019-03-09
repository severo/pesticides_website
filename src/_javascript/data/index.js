import * as csv from './csv';
import * as topojson from './topojson';

export function loadData(datasets) {
  const loaderByType = {csv: csv, topojson: topojson};
  const keys = Object.keys(datasets);
  const promises = keys.map(key =>
    loaderByType[datasets[key].type].load(datasets[key])
  );
  return Promise.all(promises).then(results => {
    // All datasets have been loaded and checked successfully
    // Build the data object
    const data = results.reduce((acc, cur, it) => {
      acc[keys[it]] = cur;
      return acc;
    }, {});
    // Return the data
    return data;
  });
}
