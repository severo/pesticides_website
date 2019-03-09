import {feature, presimplify, quantile, simplify} from 'topojson';

export function postProcess(raw) {
  // TODO: prepare the data and find the better simplification quantiles
  // TODO: see if quantification might also help
  // see https://observablehq.com/@lemonnish/minify-topojson-in-the-browser
  // TODO: compress data with gzip
  // TODO: hardcoded quantiles to cfg
  // The quantiles parameters for the topojson.simplify function are tuned for
  // the Brazilian scale, and for the median Brazilian state scale
  const quantiles = {brazil: 0.1, state: 0.3};
  const countries = toGeoJson(raw.countries, 'countries');
  const countriesBrazil = toSimplGeoJson(
    raw.countries,
    quantiles.brazil,
    'countries'
  );
  const countriesState = toSimplGeoJson(
    raw.countries,
    quantiles.state,
    'countries'
  );
  const data = {
    geojson: {
      original: {
        brazil: selectBrazil(countries),
        countries: countries,
        municipalities: toGeoJson(raw.municipalities, 'municipios'),
        states: toGeoJson(raw.states, 'estados'),
      },
      simplifiedForBrazil: {
        brazil: selectBrazil(countriesBrazil),
        countries: countriesBrazil,
        municipalities: toSimplGeoJson(
          raw.municipalities,
          quantiles.brazil,
          'municipios'
        ),
        states: toSimplGeoJson(raw.states, quantiles.brazil, 'estados'),
      },
      simplifiedForState: {
        brazil: selectBrazil(countriesState),
        countries: countriesState,
        municipalities: toSimplGeoJson(
          raw.municipalities,
          quantiles.state,
          'municipios'
        ),
        states: toSimplGeoJson(raw.states, quantiles.state, 'estados'),
      },
    },
  };
  return data;
}

function toSimplGeoJson(geom, quant, key) {
  return toGeoJson(simpl(geom, quant), key);
}

function simpl(geom, quant) {
  const preparedGeom = presimplify(geom);
  return simplify(preparedGeom, quantile(preparedGeom, quant));
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
