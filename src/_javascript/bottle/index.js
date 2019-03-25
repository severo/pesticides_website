export function makeBottle(parent, dispatcher, data) {
  startLoading(parent);

  parent.append('p').attr('id', 'text');
  makeForBrazil(parent, dispatcher, data);

  dispatcher.on('to-mun-view.bottle', mun => {
    makeForMun(parent, dispatcher, mun);
  });

  dispatcher.on('to-brazil-view.bottle', brazilData => {
    makeForBrazil(parent, dispatcher, brazilData);
  });
  endLoading(parent);
}

function makeForBrazil(parent, dispatcher, data) {
  parent.select('#text').text('[TODO] Bottle for Brazil');
}
function makeForMun(parent, dispatcher, mun) {
  parent.select('#text').text('[TODO] Bottle for ' + mun.properties.name);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
