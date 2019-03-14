import {select} from 'd3-selection';

// TODO: in cfg
// TODO: i18n
const cfg = {
  callbackTypename: 'zoom-control-changed',
  class: 'breadcrumb is-toggle',
  defaultOptionId: 'brazil',
  id: 'zoom-control',
  isActiveClass: 'is-active',
  options: [
    {
      id: 'brazil',
      text: 'Brazil',
    },
    {
      id: 'saopaolo',
      text: 'Sao Paolo',
    },
  ],
};

export function appendZoomControl(dispatcher, parent) {
  const control = parent
    .append('nav')
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
export function initControl() {
  select('#' + cfg.defaultOptionId).dispatch('click');
}
