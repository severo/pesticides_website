export function makeBottle(parent, dispatcher, data) {
  startLoading(parent);

  parent
    .append('p')
    .attr('id', 'text')
    .text('Not initialized');

  endLoading(parent);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
