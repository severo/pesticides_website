const cfg = {
  id: 'content',
};

export function appendContent(dispatcher, parent) {
  const content = parent
    .append('div')
    .attr('id', cfg.id)
    .classed('is-loading', true);

  const notification = content.append('div').classed('notification', true);

  dispatcher.on('data-loaded', data => {
    content.classed('is-loading', false);
  });

  dispatcher.on('view-changed.content', data => {
    notification.text(JSON.stringify(data, ['view', 'zoom']));
  });

  return content;
}
export function initContent() {}
