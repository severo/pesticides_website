import {dispatch} from 'd3-dispatch';
import {loadData} from './data';
import {makeBreadcrumb} from './breadcrumb';
import {makeDetails} from './details';
import {makeMap} from './map';
import {makeNav} from './nav';
import {makeSearch} from './search';
import {select} from 'd3-selection';

const dispatcher = dispatch(
  'data-loaded',
  'breadcrumb-click-brazil',
  'to-brazil-view',
  'search-results-updated',
  'search-selected',
  'mun-click-cocktail',
  'mun-click-limits',
  'to-mun-view',
  'mun-mouseover-cocktail',
  'mun-mouseout-cocktail',
  'mun-mouseover-limits',
  'mun-mouseout-limits',
  'burger-show',
  'burger-hide',
  'show-cocktail',
  'show-limits'
);

makeNav(dispatcher);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded.search', data => {
  makeSearch(select('section#search'), dispatcher, data);
});
dispatcher.on('data-loaded.breadcrumb', data => {
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, data);
});
dispatcher.on('data-loaded.details', data => {
  makeDetails(select('section#details'), dispatcher, data);
});
dispatcher.on('data-loaded.map', data => {
  makeMap(select('section#map'), dispatcher, data);
});

// Mun / Brazil
dispatcher.on('mun-click-cocktail.state search-selected.state', mun => {
  dispatcher.call('to-mun-view', null, mun);
});
dispatcher.on('breadcrumb-click-brazil.state', data => {
  dispatcher.call('to-brazil-view', null, data);
});
