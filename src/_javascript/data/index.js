import {csv, json} from 'd3-fetch';
import {deburr} from 'lodash-es';
import {feature} from 'topojson';
import {geoPath} from 'd3-geo';

const EUROPEAN_LIMIT = 0.1;
export const MAP1 = {
  CATEGORY: {
    CAT_1: 1,
    CAT_2: 2,
    CAT_3: 3,
    CAT_4: 4,
    NO_TEST: 0,
  },
  CUT_14: 14,
  CUT_27: 27,
};
export const MAP2 = {
  CATEGORY: {
    BELOW: 1,
    NO_TEST: 0,
    SUP_BR: 3,
    SUP_EU: 2,
  },
};
// integrity hash computed with:
// cat substances.20190412.csv | openssl dgst -sha384 -binary | openssl base64 -A
export const cfg = {
  substances: {
    integrityHash:
      'sha384-9FmXfWF1E7bRuSKBX9NuEGewjBybCZxXFmPgKI6RBa4sB5oen5inynkWxS0uRuOH',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/substances.20190412.csv',
  },
  // Produced by https://framagit.org/severo/sisagua - export_tests_data()
  // Exported in CSV in https://gist.github.com/severo/55c718f7a22ede328332496bf7b0d1af
  // Transformed in JSON in https://observablehq.com/d/157dd55cf0b24e0c
  // Published in https://github.com/severo/data_brazil
  tests: {
    integrityHash:
      'sha384-A0apYNqz52d3JYGAxIZ0NAZL62PfXiD0EvxqA79yyqteRm526Thk7HSx4RkbTHmS',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/tests_data.json',
  },
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
    json(cfg.tests.url, {integrity: cfg.tests.integrityHash}),
    csv(cfg.substances.url, {integrity: cfg.substances.integrityHash}),
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
      const TESTS_IDX = 0;
      const SUBST_IDX = 1;
      const TOPO_IDX = 2;
      const VALUES_IDX = 3;

      // Substances
      const substancesRaw = results[SUBST_IDX].map(cur => {
        return {
          code: cur.code,
          isHhce: cur.hhce === 'true',
          limit: +cur.limit,
          name: cur.name,
          shortName: cur.shortName,
          url:
            'https://portrasdoalimento.info/2019/04/12/conheca-os-27-agrotoxicos-encontrados-na-agua-que-abastasse-as-cidades-do-brasil/#' +
            cur.urlFragment,
        };
      });
      const substancesRawLut = substancesRaw.reduce((acc, cur) => {
        acc[cur.code] = cur;
        return acc;
      }, {});

      // Tests
      const tests = results[TESTS_IDX];

      // Topologic data
      const topo = results[TOPO_IDX];

      // Statistics
      const values = results[VALUES_IDX].reduce((acc, cur) => {
        acc[cur.ibgeCode] = cur;
        return acc;
      }, {});

      // Municipalities
      const mun = toFeatures(topo, 'municipalities');
      mun.features = mun.features.map(ft => {
        if (ft.properties.ibgeCode in values) {
          ft.properties.category = values[ft.properties.ibgeCode].category;
          ft.properties.number = values[ft.properties.ibgeCode].number;
        }
        if (ft.properties.ibgeCode in tests) {
          ft.properties.tests = parseTests(
            tests[ft.properties.ibgeCode],
            substancesRawLut
          );
          ft.properties.map1Number = ft.properties.tests.filter(
            sub => sub.max > 0
          ).length;
          if (ft.properties.map1Number === 0) {
            ft.properties.map1Category = MAP1.CATEGORY.CAT_1;
          } else if (ft.properties.map1Number < MAP1.CUT_14) {
            ft.properties.map1Category = MAP1.CATEGORY.CAT_2;
          } else if (ft.properties.map1Number < MAP1.CUT_27) {
            ft.properties.map1Category = MAP1.CATEGORY.CAT_3;
          } else {
            ft.properties.map1Category = MAP1.CATEGORY.CAT_4;
          }
          ft.properties.map2Category = ft.properties.tests.reduce(
            (acc, cur) => {
              if (cur.map2Category > acc) {
                acc = cur.map2Category;
              }
              return acc;
            },
            MAP2.CATEGORY.BELOW
          );
        } else {
          ft.properties.map1Number = NaN;
          ft.properties.map1Category = MAP1.CATEGORY.NO_TEST;
          ft.properties.map2Category = MAP2.CATEGORY.NO_TEST;
        }

        //data.brazil.features[0].properties
        // TODO: added for use in the search input. But the search could be
        // improved with Intl.Collator. In case it's improved in search/index.js
        // don't forget to modify here.
        ft.properties.deburredName = deburr(ft.properties.name);
        ft.properties.fuName = fuNames[ft.properties.fu];

        return ft;
      });

      // Add statistical data to substances
      function median(arr) {
        /* eslint-disable */
        arr = arr.sort((v1, v2) => {
          return v1 - v2;
        });
        const half = arr.length / 2;
        return half % 1 == 0
          ? (arr[half - 1] + arr[half]) / 2
          : arr[Math.floor(half)];
        /* eslint-enable */
      }
      const substances = substancesRaw.map(sub => {
        const testedIn = mun.features.filter(ft => {
          if (!('tests' in ft.properties)) {
            return false;
          }
          return (
            ft.properties.tests.filter(test => test.substance.code === sub.code)
              .length === 1
          );
        });
        const detectedIn = testedIn.filter(ft => {
          const subTest = ft.properties.tests.filter(
            test => test.substance.code === sub.code
          )[0];
          return subTest.max > 0;
        });
        const medianConcentration = median(
          testedIn.map(ft => {
            const subTest = ft.properties.tests.filter(
              test => test.substance.code === sub.code
            )[0];
            return subTest.max;
          })
        );
        return {
          code: sub.code,
          detectedIn: detectedIn.length,
          limit: sub.limit,
          medianConcentration: medianConcentration,
          name: sub.name,
          shortName: sub.shortName,
          testedIn: testedIn.length,
        };
      });
      const substancesLut = substances.reduce((acc, cur) => {
        acc[cur.code] = cur;
        return acc;
      }, {});

      const brazil = toFeatures(topo, 'republic');
      brazil.features[0].properties.tests = substances.map(sub => {
        return {
          max: sub.medianConcentration,
          substance: sub,
        };
      });

      const data = {
        brazil: brazil,
        fu: toFeatures(topo, 'federative-units'),
        internalFu: toFeatures(topo, 'internal-federative-units'),
        mun: mun,
        substancesLut: substancesLut,
      };

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

function parseTests(tests, substancesLut) {
  // Placeholder to compute max
  const DETECTED_VALUE = 1e-10;
  const keys = Object.keys(tests);
  return keys.reduce((acc, substanceCode) => {
    const test = tests[substanceCode];
    const fTest = {
      substance: substancesLut[substanceCode],
      tests: test.map(str => {
        if (str === 'NA') {
          return DETECTED_VALUE;
        }
        return +str;
      }),
    };
    fTest.max = fTest.tests.reduce((max, cur) => {
      if (cur > max) {
        max = cur;
      }
      return max;
    }, -Infinity);
    fTest.map2Category = getMap2Category(fTest.max, fTest.substance);
    acc.push(fTest);
    return acc;
  }, []);
}

function getMap2Category(max, substance) {
  if (max > substance.limit) {
    return MAP2.CATEGORY.SUP_BR;
  } else if (max > EUROPEAN_LIMIT) {
    return MAP2.CATEGORY.SUP_EU;
  }
  // Handle both no detection, and detected but lower than EU and BR limits
  return MAP2.CATEGORY.BELOW;
}
