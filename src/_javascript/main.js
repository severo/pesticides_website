import {dispatch} from 'd3-dispatch';
import {loadData} from './data';
import {makeDetails} from './details';
import {makeMap} from './map';
import {makeSearch} from './search';
import {select} from 'd3-selection';

const dispatcher = dispatch(
  'data-loaded',
  'mun-click',
  'mun-mouseover',
  'mun-mouseout',
  'search-results-updated',
  'search-selected'
);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded.search', data => {
  makeSearch(select('section#search'), dispatcher, data);
});
dispatcher.on('data-loaded.map', data => {
  makeMap(select('section#map'), dispatcher, data);
});

//
dispatcher.on('mun-click.details', mun => {
  makeDetails(select('section#details'), dispatcher, mun);
});
dispatcher.on('search-selected.details', mun => {
  makeDetails(select('section#details'), dispatcher, mun);
});
