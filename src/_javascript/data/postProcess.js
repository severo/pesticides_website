import {feature} from 'topojson';

export function postProcess(raw) {
  const countries = toGeoJson(raw.countries, 'countries');
  const data = {
    geojson: {
      brazil: selectBrazil(countries),
      countries: countries,
      municipalities: toGeoJson(raw.municipalities, 'municipios'),
      states: toGeoJson(raw.states, 'estados'),
    },
  };
  return data;
}

function toGeoJson(topojson, key) {
  return feature(topojson, topojson.objects[key]);
}

function selectBrazil(countries) {
  // TODO: put hardcoded string "Brazil" to cfg
  return {
    features: countries.features.filter(ft => ft.properties.NAME === 'Brazil'),
    type: 'FeatureCollection',
  };
}
