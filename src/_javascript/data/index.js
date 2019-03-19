import {csv, json} from 'd3-fetch';
import {deburr} from 'lodash-es';
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

const fuNames = {
  AC: 'Acre',
  AL: 'Alagoas',
  AM: 'Amazonas',
  AP: 'Amapá',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MG: 'Minas Gerais',
  MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso',
  PA: 'Pará',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  PI: 'Piauí',
  PR: 'Paraná',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RO: 'Rondônia',
  RR: 'Roraima',
  RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina',
  SE: 'Sergipe',
  SP: 'São Paulo',
  TO: 'Tocantins',
};

export function loadData(dispatcher) {
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

  return Promise.all(promises)
    .then(results => {
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
        // TODO: added for use in the search input. But the search could be
        // improved with Intl.Collator. In case it's improved in search/index.js
        // don't forget to modify here.
        ft.properties.deburredName = deburr(ft.properties.name);
        ft.properties.fuName = fuNames[ft.properties.fu];
        return ft;
      });

      // Publish the data with the "data-loaded" event
      dispatcher.call('data-loaded', this, data);
    })
    .catch(error => {
      /* TODO: decide what to do if the init has failed.
       * Meanwhile, it prints the error in the console. */
      console.log(error);
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
