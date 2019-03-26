import {select, selectAll} from 'd3-selection';

export function makeNav(dispatcher) {
  // init
  select('.navbar-burger').on('click', () => {
    dispatcher.call('burger-show');
  });
  selectAll('.navbar-menu .navbar-item').on('click', () => {
    dispatcher.call('burger-hide');
  });
  selectAll('.navbar-menu #nav-item-cocktail').on('click', () => {
    dispatcher.call('show-cocktail');
  });
  selectAll('.navbar-menu #nav-item-limits').on('click', () => {
    dispatcher.call('show-limits');
  });

  dispatcher.on('burger-show', () => {
    select('.navbar-burger')
      .classed('is-active', true)
      .on('click', () => {
        dispatcher.call('burger-hide');
      });
    select('.navbar-menu').classed('is-active', true);
  });
  dispatcher.on('burger-hide', () => {
    select('.navbar-burger')
      .classed('is-active', false)
      .on('click', () => {
        dispatcher.call('burger-show');
      });
    select('.navbar-menu').classed('is-active', false);
  });
}
