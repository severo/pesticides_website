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

export function append(dispatcher, parent, defaultState) {
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

  setActiveClass(li, defaultState.zoom);

  // TODO: ontouch?
  li.on('click', (data, id, cur) => {
    setActiveClass(li, data.id);
    // invoke callbacks
    dispatcher.call(cfg.callbackTypename, null, {
      selected: data.id,
    });
  });

  return control;
}

function setActiveClass(li, id) {
  // set the isActiveClass to the current tab
  li.classed(cfg.isActiveClass, data => data.id === id);
}
