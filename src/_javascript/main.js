import {loadData} from './data.js';

console.log(
  'A comment in the console to test JavaScript in https://github.com/severo/pesticides_website!'
);

loadData.then(data => {
  console.log(
    'The CSV file has been loaded, it contains ' + data.length + ' rows'
  );
});
