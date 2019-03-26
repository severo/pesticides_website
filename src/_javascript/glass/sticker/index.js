export function makeSticker(box, name, value, substancesLut, mun) {
  /* eslint-disable */
  const DETECTED_VALUE = 1e-10;

  const substances = [{emoji: '💧', name: 'Water', value: ''}];
  mun.properties.tests
    .sort((test1, test2) => {
      return test2.max > test1.max;
    })
    .forEach(test => {
      if (test.max > 0) {
        substances.push({
          emoji: '💀',
          name: test.substance.name,
          value:
            test.max === DETECTED_VALUE ? '' : test.max.toLocaleString('pt-BR'),
        });
      }
    });
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
    .text(substance => substance.value);
}
