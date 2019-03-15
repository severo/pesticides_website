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
  dispatcher.on('number-hover', mun => log(mun, pre));
}

function log(mun, parent) {
  parent.html('');
  parent.append('p').text('Municipality: ' + mun.id);
  parent.append('p').text('Value: ' + mun.value);
}
