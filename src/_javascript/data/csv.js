import * as d3 from 'd3';

function checkData(cfg) {
  return data => {
    /* Some basic tests to check the data seems correct
     *
     * Note: the integrity of the data has already been checked in d3.json
     */
    if (!Array.isArray(data)) {
      throw new Error('The data is not a CSV - at ' + cfg.url);
    } else if (data.length !== cfg.rowsNumber) {
      throw new Error('The number of rows should be ' + cfg.rowsNumber);
    }
    return data;
  };
}

export function load(cfg) {
  return d3.csv(cfg.url, {integrity: cfg.integrityHash}).then(checkData(cfg));
}
