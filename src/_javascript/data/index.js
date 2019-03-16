import {csv, json} from 'd3-fetch';
import {feature} from 'topojson';

export const cfg = {
  topojson: {
    integrityHash:
      'sha384-EHOxB3BF2QMvROtvl9UgiCGfI+Lez4J+/CVqtoAhHbv9JsZ7F8FmK5GP5xMzZtsG',
    url: 'data/br-px-topo.2019031601.json',
  },
  values: {
    integrityHash:
      'sha384-1mMiVJ4KDmhyjlz86hL3dd+AYo/ShdE/2L8iW5nCdsUHlgsMt9ZS/PTVg12LyTZM',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/data_by_municipality_for_maps.csv',
  },
};

export function loadData() {
  const promises = [
    json(cfg.topojson.url, {integrity: cfg.topojson.integrityHash}),
    csv(cfg.values.url, {integrity: cfg.values.integrityHash}, row => {
      return {
        category: {
          atrAvgCat: row.atrazine_average_category,
          atrMaxCat: row.atrazine_category,
          simAvgCat: row.simazine_average_category,
          simMaxCat: row.simazine_category,
        },
        ibgeCode: row.ibge_code,
        number: {
          detected: +row.detected,
          eqBr: +row.eq_br,
          supBr: +row.sup_br,
          supEu: +row.sup_eu,
        },
      };
    }),
  ];

  return Promise.all(promises).then(results => {
    // All datasets have been loaded and checked successfully
    const topo = results[0];
    const values = results[1].reduce((acc, cur) => {
      acc[cur.ibgeCode] = cur;
      return acc;
    }, {});

    const data = {
      brazil: toGeoJson(topo, 'republic'),
      fu: toGeoJson(topo, 'federative-units'),
      internalFu: toGeoJson(topo, 'internal-federative-units'),
      mun: toGeoJson(topo, 'municipalities'),
    };
    data.mun.features = data.mun.features.map(ft => {
      if (ft.properties.ibgeCode in values) {
        ft.properties.category = values[ft.properties.ibgeCode].category;
        ft.properties.number = values[ft.properties.ibgeCode].number;
      } else {
        ft.properties.values = {};
      }
      return ft;
    });

    return data;
  });
}

function toGeoJson(topojson, key) {
  return feature(topojson, topojson.objects[key]);
}
