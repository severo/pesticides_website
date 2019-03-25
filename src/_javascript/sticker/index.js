export function makeSticker(parent, dispatcher, data) {
  startLoading(parent);

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
  dispatcher.on(
    'tabs-click-sticker.sticker bottle-show-sticker.sticker',
    () => {
      parent.classed('is-hidden', false);
    }
  );
  endLoading(parent);
}

function makeForBrazil(parent, dispatcher, data) {
  makeList(parent, 'Brazil');
}
function makeForMun(parent, dispatcher, mun) {
  makeList(parent, mun.properties.name);
}

const pesticides = [
  {name: 'Atrazine', value: 1.5},
  {name: 'Simazine', value: 0.7},
  {name: 'Gliphosate', value: 0.4},
];
function makeList(parent, title) {
  parent.html(null);
  const box = parent.append('div').classed('composition-box', true);
  const header = box.append('header').classed('has-text-centered', true);
  header
    .append('h2')
    .classed('is-4', true)
    .text('Composition in mg/L');
  header
    .append('h4')
    .classed('is-6', true)
    .text(title);
  const list = box
    .append('ul')
    .classed('substances-list', true)
    .selectAll('li')
    .data(pesticides)
    .enter()
    .append('li');
  list
    .append('span')
    .classed('name', true)
    // TODO: replace emoji by an SVG icon
    .text(substance => '💀 ' + substance.name);
  list
    .append('span')
    .classed('value', true)
    .text(substance => substance.value.toLocaleString('pt-BR'));
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
