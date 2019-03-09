import * as csv from './csv';
import * as topojson from './topojson';

export function loadData(datasets, dispatcher) {
  const loaderByType = {csv: csv, topojson: topojson};
  const keys = Object.keys(datasets);
  const promises = keys.map(key =>
    loaderByType[datasets[key].type].load(datasets[key])
  );
  return Promise.all(promises).then(results => {
    /* All datasets have been loaded and checked successfully */
    /* Build the data object */
    const data = results.reduce((acc, cur, it) => {
      acc[keys[it]] = cur;
      return acc;
    }, {});
    /* Publish the data with the "load" event */
    dispatcher.call('load', this, data);
    /* Return the data
     * (should be useless for this application - to be removed) */
    return data;
  });
}
