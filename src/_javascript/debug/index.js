export function appendDebug(dispatcher, parent) {
  const debugElement = parent
    .append('div')
    .classed('debug', true)
    .append('footer')
    .classed('footer', true)
    .append('div')
    .classed('content', true);
  debugElement.append('h3').text('Debug');
  const pre = debugElement.append('pre');
  dispatcher.on('number-hover', data => log(data, pre));
}

function log(data, parent) {
  parent.html('');
  parent.append('p').text('Municipality: ' + data.id);
  parent.append('p').text('Value: ' + data.value);
}
