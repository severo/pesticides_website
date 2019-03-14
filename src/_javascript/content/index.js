const cfg = {
  id: 'content',
};

export function appendContent(dispatcher, parent) {
  const content = parent
    .append('div')
    .attr('id', cfg.id)
    .classed('is-loading', true);

  const notification = content.append('div').classed('notification', true);

  dispatcher.on('state-changed.content', data => {
    content.classed('is-loading', true);
    notification.text(JSON.stringify(data, ['view', 'zoom']));
    content.classed('is-loading', false);
  });

  return content;
}
export function initContent() {}
