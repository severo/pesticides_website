import {csv, json} from 'd3-fetch';
import {feature} from 'topojson';
import {geoPath} from 'd3-geo';

export const cfg = {
  topojson: {
    integrityHash:
      'sha384-T57m5+BaBiLe7uyAZrKOU/BqCXtK9t0ZIj+YXAUES8EOxrngeVCKflSzZXnB9kVd',
    url: 'data/br-px-topo.2019031701.json',
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
      brazil: toFeatures(topo, 'republic'),
      fu: toFeatures(topo, 'federative-units'),
      internalFu: toFeatures(topo, 'internal-federative-units'),
      mun: toFeatures(topo, 'municipalities'),
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

function toFeatures(topojson, key) {
  // TODO: do the following computation at build time
  const path = geoPath();
  const features = feature(topojson, topojson.objects[key]);
  features.features.map(ft => {
    if (!('properties' in ft)) {
      ft.properties = {};
    }
    ft.properties.centroid = path.centroid(ft.geometry);
    ft.properties.bounds = path.bounds(ft.geometry);
    ft.properties.height =
      ft.properties.bounds[1][1] - ft.properties.bounds[0][1];
    ft.properties.width =
      ft.properties.bounds[1][0] - ft.properties.bounds[0][0];
    ft.properties.radius =
      Math.sqrt(
        ft.properties.height * ft.properties.height +
          ft.properties.width * ft.properties.width
      ) / 2; // eslint-disable-line no-magic-numbers
    return ft;
  });
  return features;
}
