import {select} from 'd3-selection';

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
    .attr('id', 'substance-select-control')
    .selectAll('option')
    .data(substances)
    .enter()
    .append('option')
    .property('value', sub => sub.code)
    .text(sub => sub.shortName);

  parent.classed('is-hidden', false);

  select('#substance-select-control').on('change', (aa, bb, cc) => {
    // TODO: launch promises, and cancel any previous running promise
    const value = cc[0].value;
    dispatcher.call('substance-selected', null, data.substancesLut[value]);
  });
}

export function removeSubstanceSelect(parent) {
  parent.classed('is-hidden', true);
  parent.html(null);
}
