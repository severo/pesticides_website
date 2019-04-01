//import {makeSubstanceSelect, removeSubstanceSelect} from './substance';
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
  'burger-hide',
  'substance-selected'
);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded.main', data => {
  const state = {data: data};
  makeNav(dispatcher, state);
  makeSearch(select('section#search'), dispatcher, state);
  dispatcher.call('make-app-cocktail', null, state);
});

dispatcher.on('make-app-cocktail.main', state => {
  //removeSubstanceSelect(select('#substance-select'));
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, state);
  makeDetails(select('section#details'), dispatcher, 'cocktail', state);
  makeMap(select('section#map'), dispatcher, 'cocktail', state);
});

dispatcher.on('make-app-limits.main', state => {
  //removeSubstanceSelect(select('#substance-select'));
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, state);
  makeDetails(select('section#details'), dispatcher, 'limits', state);
  makeMap(select('section#map'), dispatcher, 'limits', state);
});

dispatcher.on('make-app-substances.main', state => {
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, state);
  //makeSubstanceSelect(select('#substance-select'), dispatcher, state);
  makeDetails(select('section#details'), dispatcher, 'substances', state);
  makeMap(select('section#map'), dispatcher, 'substances', state);
});

// Mun / Brazil
dispatcher.on('mun-click.main search-selected.main', mun => {
  dispatcher.call('to-mun-view', null, mun);
});
dispatcher.on('breadcrumb-click-brazil.main', () => {
  dispatcher.call('to-brazil-view');
});
