import {dispatch} from 'd3-dispatch';
//import {makeSubstanceSelect, removeSubstanceSelect} from './substance';
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
  'substance-selected',
  'zoomed'
);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded.main', data => {
  const state = {data: data};
  makeNav(dispatcher, state);
  makeSearch(select('section#search'), dispatcher, state);
  makeMap(select('section#map'), dispatcher, data);

  dispatcher.call('make-app-cocktail', null, state);
});

dispatcher.on('make-app-cocktail.main', state => {
  //removeSubstanceSelect(select('#substance-select'));
  const view = 'cocktail';
  updateApp(view);
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, state);
  makeDetails(select('section#details'), dispatcher, view, state);
});

dispatcher.on('make-app-limits.main', state => {
  //removeSubstanceSelect(select('#substance-select'));
  const view = 'limits';
  updateApp(view);
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, state);
  makeDetails(select('section#details'), dispatcher, view, state);
});

/*dispatcher.on('make-app-substances.main', state => {
  const view = 'substances';
  updateApp(view);
  makeBreadcrumb(select('nav#breadcrumb'), dispatcher, state);
  //makeSubstanceSelect(select('#substance-select'), dispatcher, state);
  makeDetails(select('section#details'), dispatcher, view, state);
  makeMap(select('section#map'), dispatcher, view, state);
});
*/

// Mun / Brazil
dispatcher.on('mun-click.main search-selected.main', mun => {
  dispatcher.call('to-mun-view', null, mun);
});
dispatcher.on('breadcrumb-click-brazil.main', () => {
  dispatcher.call('to-brazil-view');
});

function updateApp(view) {
  // TODO: don't hardcode
  select('section#app')
    .classed('cocktail', false)
    .classed('limits', false)
    .classed('substances', false)
    .classed(view, true);
}
