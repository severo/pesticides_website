export function makeSticker(parent, dispatcher, data) {
  startLoading(parent);

  parent.append('p').attr('id', 'text');
  makeForBrazil(parent, dispatcher, data);

  dispatcher.on('to-mun-view.sticker', mun => {
    makeForMun(parent, dispatcher, mun);
  });
  dispatcher.on('to-brazil-view.sticker', brazilData => {
    makeForBrazil(parent, dispatcher, brazilData);
  });

  dispatcher.on('tabs-click-map.sticker', () => {
    parent.classed('is-hidden', true);
  });
  dispatcher.on('tabs-click-sticker.sticker', () => {
    parent.classed('is-hidden', false);
  });
  endLoading(parent);
}

function makeForBrazil(parent, dispatcher, data) {
  parent.select('#text').text('[TODO] Sticker for Brazil');
}
function makeForMun(parent, dispatcher, mun) {
  parent.select('#text').text('[TODO] Sticker for ' + mun.properties.name);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
