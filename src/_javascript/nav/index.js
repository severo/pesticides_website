import {select, selectAll} from 'd3-selection';

export function makeNav(dispatcher, state) {
  // init
  updateNav(dispatcher, state);
  select('#navbarMaps #nav-item-cocktail').classed('is-active', true);

  dispatcher.on('to-brazil-view.nav', () => {
    updateNav(dispatcher, {data: state.data});
  });
  dispatcher.on('to-mun-view.nav', mun => {
    updateNav(dispatcher, {data: state.data, mun: mun});
  });
}

function updateNav(dispatcher, state) {
  // TODO: we could factorize
  select('#navbarMaps #nav-item-cocktail').on('click', () => {
    selectAll('#navbarMaps .navbar-item').classed('is-active', false);
    select('#navbarMaps #nav-item-cocktail').classed('is-active', true);
    select('#page-title').classed('cocktail', true);
    select('#page-title').classed('limits', false);
    select('#page-title').classed('substances', false);
    dispatcher.call('make-app-cocktail', null, state);
  });
  select('#navbarMaps #nav-item-limits').on('click', () => {
    selectAll('#navbarMaps .navbar-item').classed('is-active', false);
    select('#navbarMaps #nav-item-limits').classed('is-active', true);
    select('#page-title').classed('cocktail', false);
    select('#page-title').classed('limits', true);
    select('#page-title').classed('substances', false);
    dispatcher.call('make-app-limits', null, state);
  });
  select('#navbarMaps #nav-item-substances').on('click', () => {
    selectAll('#navbarMaps .navbar-item').classed('is-active', false);
    select('#navbarMaps #nav-item-substances').classed('is-active', true);
    select('#page-title').classed('cocktail', false);
    select('#page-title').classed('limits', false);
    select('#page-title').classed('substances', true);
    dispatcher.call('make-app-substances', null, state);
  });
}
