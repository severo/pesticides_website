export function makeMapStickerTabs(parent, dispatcher, data) {
  startLoading(parent);

  const ul = parent.select('ul');

  ul.select('li.map').on('click', (ft, element) => {
    // invoke callbacks
    dispatcher.call('tabs-click-map', null, null);
    toMap(parent);
  });
  ul.select('li.sticker').on('click', (ft, element) => {
    // invoke callbacks
    dispatcher.call('tabs-click-sticker', null, null);
    toSticker(parent);
  });

  endLoading(parent);
}

function toMap(parent) {
  parent.select('ul li.sticker').classed('is-active', false);
  parent.select('ul li.map').classed('is-active', true);
}

function toSticker(parent) {
  parent.select('ul li.map').classed('is-active', false);
  parent.select('ul li.sticker').classed('is-active', true);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
