import * as d3 from 'd3';

const NUMBER_STATES = 27;
const INTEGRITY_HASH =
  'sha384-ouQz9pxNn8qAzuMhLlb5tBC+H8tZ7nniJlpcWSVLHwx7QKja0yPvC08KJSqiTtvi';

function checkData(url) {
  return data => {
    /* Some basic tests to check the data seems correct
     *
     * Note: the integrity of the data has already been checked in d3.json
     */
    if (!data.hasOwnProperty('type') || data.type !== 'Topology') {
      throw new Error('The data is not a topojson - at ' + url);
    } else if (data.objects.estados.geometries.length !== NUMBER_STATES) {
      throw new Error('The number of states should be ' + NUMBER_STATES);
    }
    return data;
  };
}

export function load(url) {
  return d3.json(url, {integrity: INTEGRITY_HASH}).then(checkData(url));
}
