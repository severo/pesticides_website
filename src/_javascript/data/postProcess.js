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

  // TODO: filter the countries in the topojson, not in the resulting geojson
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
        countries: selectCountries(countries),
        municipalities: toGeoJson(raw.municipalities, 'municipios'),
        states: toGeoJson(raw.states, 'estados'),
      },
      simplifiedForBrazil: {
        brazil: selectBrazil(countriesBrazil),
        countries: selectCountries(countriesBrazil),
        municipalities: toSimplGeoJson(
          raw.municipalities,
          quantiles.brazil,
          'municipios'
        ),
        states: toSimplGeoJson(raw.states, quantiles.brazil, 'estados'),
      },
      simplifiedForState: {
        brazil: selectBrazil(countriesState),
        countries: selectCountries(countriesState),
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

function selectCountries(countries) {
  // TODO: move hardcoded strings to cfg
  // TODO: i18n the labels
  const selectedCountries = [
    {
      label: 'Bolivia',
      name: 'Bolivia',
      shortLabel: 'BO',
    },
    {
      label: 'Paraguay',
      name: 'Paraguay',
      shortLabel: 'PY',
    },
    {
      label: 'Chile',
      name: 'Chile',
      shortLabel: 'CL',
    },
    {
      label: 'Colombia',
      name: 'Colombia',
      shortLabel: 'CO',
    },
    {
      label: 'Peru',
      name: 'Peru',
      shortLabel: 'PE',
    },
    {
      label: 'Argentina',
      name: 'Argentina',
      shortLabel: 'AR',
    },
    {
      label: 'Uruguay',
      name: 'Uruguay',
      shortLabel: 'UY',
    },
    {
      label: 'Venezuela',
      name: 'Venezuela',
      shortLabel: 'VZ',
    },
    {
      label: 'Ecuador',
      name: 'Ecuador',
      shortLabel: 'EC',
    },
    {
      label: 'Guyana',
      name: 'Guyana',
      shortLabel: 'GY',
    },
    {
      label: 'French Guyana',
      name: 'France',
      shortLabel: 'GF',
    },
    {
      label: 'Suriname',
      name: 'Suriname',
      shortLabel: 'SU',
    },
  ];
  // TODO: select only French Guyana, from the France geometry

  return {
    features: countries.features.filter(ft =>
      selectedCountries.some(sc => ft.properties.NAME === sc.name)
    ),
    type: 'FeatureCollection',
  };
}

function selectBrazil(countries) {
  // TODO: put hardcoded string "Brazil" to cfg
  return {
    features: countries.features.filter(ft => ft.properties.NAME === 'Brazil'),
    type: 'FeatureCollection',
  };
}
