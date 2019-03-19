export function makeDetails(parent, dispatcher, mun) {
  startLoading(parent);

  // Clean existing contents
  // TODO: be more clever?
  parent.html(null);

  makeHeader(parent, mun);

  endLoading(parent);
}

function makeHeader(parent, mun) {
  const header = parent.append('header').attr('id', 'idCard');

  header.append('h2').text(mun.properties.name);

  const fu = header.append('h3');
  fu.append('span')
    .classed('icon', true)
    .append('i')
    .classed('fas fa-map-marker-alt', true);
  fu.append('span').text(mun.properties.fu);
}
function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
