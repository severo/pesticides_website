import {cfg} from './cfg';
import {load as csv} from './csv';
import {postProcess} from './postProcess';
import {load as topojson} from './topojson';

export function loadData() {
  const loadByType = {csv: csv, topojson: topojson};
  const keys = Object.keys(cfg);
  const promises = keys.map(key => {
    const datasetCfg = cfg[key];
    const load = loadByType[datasetCfg.type];
    return load(datasetCfg);
  });
  return Promise.all(promises).then(results => {
    // All datasets have been loaded and checked successfully

    // Add keys to the data in a new object
    const raw = results.reduce((acc, cur, it) => {
      acc[keys[it]] = cur;
      return acc;
    }, {});

    // Post-processing
    const data = postProcess(raw);

    // Return the data
    return data;
  });
}
