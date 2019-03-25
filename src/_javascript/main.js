import {dispatch} from 'd3-dispatch';
import {loadData} from './data';
import {makeBottle} from './bottle';
import {makeBreadcrumb} from './breadcrumb';
import {makeMap} from './map';
import {makeSearch} from './search';
import {select} from 'd3-selection';

const dispatcher = dispatch(
  'breadcrumb-click-brazil',
  'data-loaded',
  'mun-click',
  'mun-mouseover',
  'mun-mouseout',
  'search-results-updated',
  'search-selected',
  'to-mun-view',
  'to-brazil-view'
);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded.search', data => {
  makeSearch(select('section#search'), dispatcher, data);
});
dispatcher.on('data-loaded.breadcrumb', data => {
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, data);
});
dispatcher.on('data-loaded.bottle', data => {
  makeBottle(select('section#bottle'), dispatcher, data);
});
dispatcher.on('data-loaded.map', data => {
  makeMap(select('section#map'), dispatcher, data);
});

//
dispatcher.on('mun-click.state search-selected.state', mun => {
  dispatcher.call('to-mun-view', null, mun);
});
dispatcher.on('breadcrumb-click-brazil.state', data => {
  dispatcher.call('to-brazil-view', null, data);
});
