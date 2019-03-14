import {select} from 'd3-selection';

// TODO: in cfg
// TODO: i18n
const cfg = {
  callbackTypename: 'view-control-changed',
  class: 'tabs is-centered is-fullwidth',
  defaultOptionId: 'number',
  id: 'view-control',
  isActiveClass: 'is-active',
  options: [
    {
      id: 'number',
      text: 'Number of pesticides',
    },
    {
      id: 'concentration',
      text: 'Over safe limit',
    },
  ],
};

export function append(dispatcher, parent) {
  const control = parent
    .append('div')
    .attr('id', cfg.id)
    .classed(cfg.class, true);

  const ul = control.append('ul');

  const li = ul
    .selectAll('li')
    .data(cfg.options)
    .enter()
    .append('li')
    .attr('id', opt => opt.id);

  li.append('a').text(opt => opt.text);

  // TODO: ontouch?
  li.on('click', (data, id, cur) => {
    // change style
    li.classed(cfg.isActiveClass, false);
    select(cur[id]).classed(cfg.isActiveClass, true);

    // invoke callbacks
    dispatcher.call(cfg.callbackTypename, null, {
      selected: data.id,
    });
  });

  return control;
}
export function init() {
  select('#' + cfg.defaultOptionId).dispatch('click');
}
