import {makeSubstanceSelect, removeSubstanceSelect} from './substance';
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
  'to-mun-view',
  'search-results-updated',
  'search-selected',
  'make-app-cocktail',
  'make-app-limits',
  'make-app-substances',
  'mun-click',
  'mun-mouseover',
  'mun-mouseout',
  'burger-show',
  'burger-hide'
);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded', data => {
  makeNav(dispatcher, data);
  makeSearch(select('section#search'), dispatcher, data);
  dispatcher.call('make-app-cocktail', null, data);
});

dispatcher.on('make-app-cocktail', data => {
  removeSubstanceSelect(select('#substance-select'));
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, data);
  makeDetails(select('section#details'), dispatcher, 'cocktail', data);
  makeMap(select('section#map'), dispatcher, 'cocktail', data);
});

dispatcher.on('make-app-limits', data => {
  removeSubstanceSelect(select('#substance-select'));
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, data);
  makeDetails(select('section#details'), dispatcher, 'limits', data);
  makeMap(select('section#map'), dispatcher, 'limits', data);
});

dispatcher.on('make-app-substances', data => {
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, data);
  makeSubstanceSelect(select('#substance-select'), dispatcher, data);
  makeDetails(select('section#details'), dispatcher, 'substances', data);
  makeMap(select('section#map'), dispatcher, 'substances', data);
});

// Mun / Brazil
dispatcher.on('mun-click.state search-selected.state', mun => {
  dispatcher.call('to-mun-view', null, mun);
});
dispatcher.on('breadcrumb-click-brazil.state', data => {
  dispatcher.call('to-brazil-view', null, data);
});
