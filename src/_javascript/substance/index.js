export function makeSubstanceSelect(parent, dispatcher, data) {
  const substances = Object.keys(data.substancesLut).map(key => {
    return data.substancesLut[key];
  });

  parent.html(null);
  parent
    .append('div')
    .classed('field-label is-normal', true)
    .append('label')
    .classed('label', true)
    .text('Select a substance');

  parent
    .append('div')
    .classed('field-body', true)
    .append('div')
    .classed('field is-expanded', true)
    .append('div')
    .classed('control', true)
    .append('div')
    .classed('select is-fullwidth', true)
    .append('select')
    .selectAll('option')
    .data(substances)
    .enter()
    .append('option')
    .property('value', sub => sub.code)
    .text(sub => sub.shortName);

  parent.classed('is-hidden', false);

  /*  select('#search-input').on('input', (aa, bb, cc) => {
    // TODO: launch promises, and cancel any previous running promise

    const text = cc[0].value;
    dispatcher.call(
      'search-results-updated',
      null,
      // Maybe use Intl.Collator instead
      // https://github.com/nol13/fuzzball.js#collation-and-unicode-stuff
      // But I think it will not change anything in the result, and make it
      // slower
      fuzz.extract(deburr(text), choices, options)
    );
  });

  dispatcher.on('search-results-updated.search', fuseResults => {
    updateResults(fuseResults, dispatcher);
  });

  dispatcher.on('search-selected.search', mun => {
    parent.select('#search-input').property('value', '');
  });*/
}

export function removeSubstanceSelect(parent) {
  parent.classed('is-hidden', true);
  parent.html(null);
}
