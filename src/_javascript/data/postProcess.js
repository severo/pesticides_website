import {feature, presimplify, simplify} from 'topojson';

export function postProcess(raw) {
  // TODO: prepare the data before hand
  const NUM_CHAR_IBGE_CODE = 6;
  const munG = raw.municipalities.objects.municipios.geometries;
  const municipalities = raw.municipalities;
  municipalities.objects.municipios.geometries = munG.map(mun => {
    // TODO: do immutably
    mun.properties.ibgeCode = mun.properties.geocodigo.slice(
      0,
      NUM_CHAR_IBGE_CODE
    );
    return mun;
  });

  const statistics = raw.statistics.reduce((acc, cur) => {
    acc[cur.ibge_code] = cur;
    return acc;
  }, {});

  // TODO: prepare the data and find the best simplification levels
  // TODO: see if quantification might also help
  // see https://observablehq.com/@lemonnish/minify-topojson-in-the-browser
  // TODO: compress data with gzip

  // The smallest retained area (triangle) in px^2
  // See https://bost.ocks.org/mike/simplify/
  // Value between 1 and 4 px^2 seem to be optimal
  // TODO: hardcoded values to cfg
  const BRAZIL_MIN_AREA_PX2 = 2.25;
  const STATE_MIN_AREA_PX2 = 1;
  // TODO: The data are in degrees. We need to project (using
  // the projection we want for the application), for a given level of zoom, and
  // then we can compute the area in px^2. We just scale until it seems correct,
  // and we will compute the area when we have the time to bikeshed
  const minAreaToSimplificationFactor = 0.01;
  const simplificationFactors = {
    brazil: BRAZIL_MIN_AREA_PX2 * minAreaToSimplificationFactor,
    state: STATE_MIN_AREA_PX2 * minAreaToSimplificationFactor,
  };

  // TODO: filter the countries in the topojson, not in the resulting geojson
  const countries = toGeoJson(raw.countries, 'countries');
  const countriesBrazil = toSimplGeoJson(
    raw.countries,
    simplificationFactors.brazil,
    'countries'
  );
  const countriesState = toSimplGeoJson(
    raw.countries,
    simplificationFactors.state,
    'countries'
  );
  const data = {
    geojson: {
      original: {
        brazil: selectBrazil(countries),
        countries: selectCountries(countries),
        municipalities: toGeoJson(municipalities, 'municipios'),
        states: toGeoJson(raw.states, 'estados'),
      },
      simplifiedForBrazil: {
        brazil: selectBrazil(countriesBrazil),
        countries: selectCountries(countriesBrazil),
        municipalities: toSimplGeoJson(
          municipalities,
          simplificationFactors.brazil,
          'municipios'
        ),
        states: toSimplGeoJson(
          raw.states,
          simplificationFactors.brazil,
          'estados'
        ),
      },
      simplifiedForState: {
        brazil: selectBrazil(countriesState),
        countries: selectCountries(countriesState),
        municipalities: toSimplGeoJson(
          municipalities,
          simplificationFactors.state,
          'municipios'
        ),
        states: toSimplGeoJson(
          raw.states,
          simplificationFactors.state,
          'estados'
        ),
      },
    },
    // TODO: use population?
    //population: population,
    statistics: statistics,
  };
  return data;
}

function toSimplGeoJson(geom, factor, key) {
  return toGeoJson(simpl(geom, factor), key);
}

function simpl(geom, factor) {
  const preparedGeom = presimplify(geom);
  return simplify(preparedGeom, factor);
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
