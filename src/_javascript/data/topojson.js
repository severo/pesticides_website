import {json} from 'd3-fetch';

function checkData(cfg) {
  return data => {
    /* Some basic tests to check the data seems correct
     *
     * Note: the integrity of the data has already been checked in d3.json
     */
    if (!data.hasOwnProperty('type') || data.type !== 'Topology') {
      throw new Error('The data is not a topojson - at ' + cfg.url);
    } else if (
      data.objects[cfg.topojsonKey].geometries.length !== cfg.geometriesNumber
    ) {
      throw new Error(
        'The number of geometries should be ' + cfg.geometriesNumber
      );
    }
    return data;
  };
}

export function load(cfg) {
  return json(cfg.url, {integrity: cfg.integrityHash}).then(checkData(cfg));
}
