import {csv} from 'd3-fetch';

const url =
  'https://raw.githubusercontent.com/severo/data_brazil/master/data_by_municipality_for_maps.csv';

csv(url).then(data => {
  console.log(
    'A comment in the console to test JavaScript in https://github.com/severo/pesticides_website!'
  );
  console.log(
    'The CSV file has been loaded, it contains ' + data.length + ' rows'
  );
});
