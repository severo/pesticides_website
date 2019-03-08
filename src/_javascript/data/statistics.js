import * as d3 from 'd3';

const ROWS = 2242;
const INTEGRITY_HASH =
  'sha384-1mMiVJ4KDmhyjlz86hL3dd+AYo/ShdE/2L8iW5nCdsUHlgsMt9ZS/PTVg12LyTZM';

function checkData(url) {
  return data => {
    /* Some basic tests to check the data seems correct
     *
     * Note: the integrity of the data has already been checked in d3.json
     */
    if (!Array.isArray(data)) {
      throw new Error('The data is not a CSV - at ' + url);
    } else if (data.length !== ROWS) {
      throw new Error('The number of rows of statistics should be ' + ROWS);
    }
    return data;
  };
}

export function load(url) {
  return d3.csv(url, {integrity: INTEGRITY_HASH}).then(checkData(url));
}
