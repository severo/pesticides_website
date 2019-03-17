export function makeDetails(parent, dispatcher, mun) {
  startLoading(parent);

  // Clean existing contents
  // TODO: be more clever?
  parent.html(null);

  parent.append('h3').text(mun.properties.name);
  parent.append('h4').text(mun.properties.fu);
  endLoading(parent);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
