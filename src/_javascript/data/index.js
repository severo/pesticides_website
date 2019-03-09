import * as municipalities from './municipalities';
import * as states from './states';
import * as statistics from './statistics';

export function loadData(cfg, dispatcher) {
  const datasets = [municipalities, states, statistics];
  const keys = datasets.map(cur => cur.key);
  const promises = datasets.map(cur => cur.load(cfg[cur.key]));
  return Promise.all(promises).then(results => {
    /* Form the data object */
    const data = results.reduce((acc, cur, it) => {
      acc[keys[it]] = cur;
      return acc;
    }, {});
    /* Publish the change in data */
    dispatcher.call('load', this, data);
    /* Return the data (useless for this application - to be removed) */
    return data;
  });
}
