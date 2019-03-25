export function makeBottle(parent, dispatcher, data) {
  startLoading(parent);

  // Clean existing contents
  // TODO: be more clever?
  parent.html(null);

  parent
    .append('p')
    .attr('id', 'text')
    .text('Not initialized');

  dispatcher.on('search-selected.bottle mun-click.bottle', mun => {
    parent.select('#text').text('Bottle for ' + mun.properties.name);
  });

  endLoading(parent);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
