import {csv} from 'd3-fetch';

const url =
  'https://raw.githubusercontent.com/severo/data_brazil/master/data_by_municipality_for_maps.csv';

const loadData = csv(url);

export {loadData};
