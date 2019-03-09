import {feature, merge} from 'topojson';

export function postProcess(raw) {
  /* TODO: we could get Brazil path from countries, instead of raw.states
   */
  const data = {
    geojson: {
      brazil: merge(raw.states, raw.states.objects.estados.geometries),
      countries: toGeoJson(raw.countries, 'countries'),
      municipalities: toGeoJson(raw.municipalities, 'municipios'),
      states: toGeoJson(raw.states, 'estados'),
    },
  };
  return data;
}

function toGeoJson(topojson, key) {
  return feature(topojson, topojson.objects[key]);
}
