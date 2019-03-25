const water = {emoji: '💧', name: 'Water', value: NaN};
const pesticides = [
  {emoji: '💀', name: 'Atrazine', value: 1.5},
  {emoji: '💀', name: 'Simazine', value: 0.7},
  {emoji: '💀', name: 'Gliphosate', value: 0.4},
];
export function makeSticker(box, name, value) {
  /* eslint-disable */
  const substances = [water];
  if (Number.isInteger(value)) {
    Array.from({length: value}, (_, i) => i).forEach(i => {
      substances.push(pesticides[i % 3]);
    });
  }
  /* eslint-enable */

  box.html(null);
  const header = box.append('header').classed('has-text-centered', true);
  header
    .append('h2')
    .classed('is-4', true)
    .text('Composition in mg/L');
  header
    .append('h4')
    .classed('is-6', true)
    .text(name);
  const list = box
    .append('ul')
    .classed('substances-list', true)
    .selectAll('li')
    .data(substances)
    .enter()
    .append('li');
  list
    .append('span')
    .classed('name', true)
    // TODO: replace emoji by an SVG icon
    .text(substance => substance.emoji + ' ' + substance.name);
  list
    .append('span')
    .classed('value', true)
    .text(substance =>
      isNaN(substance.value) ? '' : substance.value.toLocaleString('pt-BR')
    );
}
