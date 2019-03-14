const cfg = {
  id: 'content',
};

export function appendContent(dispatcher, parent) {
  const controls = parent
    .append('div')
    .attr('id', cfg.id)
    .classed('is-loading', true);

  dispatcher.on('data-loaded', data => {
    controls.classed('is-loading', false);
  });
  return controls;
}
export function initContent() {}
