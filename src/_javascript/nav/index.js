import {select, selectAll} from 'd3-selection';

export function makeNav(dispatcher, state) {
  // init
  select('.navbar-burger').on('click', () => {
    dispatcher.call('burger-show');
  });
  selectAll('.navbar-menu .navbar-item').on('click', () => {
    dispatcher.call('burger-hide');
  });
  updateNav(dispatcher, state);

  dispatcher.on('to-brazil-view.nav', () => {
    updateNav(dispatcher, {data: state.data});
  });
  dispatcher.on('to-mun-view.nav', mun => {
    updateNav(dispatcher, {data: state.data, mun: mun});
  });

  dispatcher.on('burger-show.nav', () => {
    select('.navbar-burger')
      .classed('is-active', true)
      .on('click', () => {
        dispatcher.call('burger-hide');
      });
    select('.navbar-menu').classed('is-active', true);
  });
  dispatcher.on('burger-hide.nav', () => {
    select('.navbar-burger')
      .classed('is-active', false)
      .on('click', () => {
        dispatcher.call('burger-show');
      });
    select('.navbar-menu').classed('is-active', false);
  });
}

function updateNav(dispatcher, state) {
  select('.navbar-menu #nav-item-cocktail').on('click', () => {
    dispatcher.call('make-app-cocktail', null, state);
  });
  select('.navbar-menu #nav-item-limits').on('click', () => {
    dispatcher.call('make-app-limits', null, state);
  });
  select('.navbar-menu #nav-item-substances').on('click', () => {
    dispatcher.call('make-app-substances', null, state);
  });
}
