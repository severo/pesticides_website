import * as d3 from 'd3';

function checkData(cfg) {
  return data => {
    /* Some basic tests to check the data seems correct
     *
     * Note: the integrity of the data has already been checked in d3.json
     */
    if (!data.hasOwnProperty('type') || data.type !== 'Topology') {
      throw new Error('The data is not a topojson - at ' + cfg.url);
    } else if (
      data.objects.municipios.geometries.length !== cfg.municipalitiesNumber
    ) {
      throw new Error(
        'The number of municipalities should be ' + cfg.municipalitiesNumber
      );
    }
    return data;
  };
}

export function load(cfg) {
  return d3.json(cfg.url, {integrity: cfg.integrityHash}).then(checkData(cfg));
}
export const key = 'municipalities';
