import * as d3Path from 'd3-path';
import {interpolateYlOrRd, scaleLinear} from 'd3';
import {makeSticker} from './sticker';

export function makeGlass(parent, dispatcher, data) {
  startLoading(parent);

  makeBasis(parent);

  // Init
  // TODO: compute the mean color for Brazil
  const fakeNum = 17;
  makeUpperLayer(parent, dispatcher, 'Brazil', fakeNum);

  dispatcher.on('to-brazil-view.glass', brazilData => {
    makeUpperLayer(parent, dispatcher, 'Brazil', fakeNum);
  });

  dispatcher.on('to-mun-view.glass', mun => {
    makeUpperLayer(parent, dispatcher, mun.properties.name, getValue(mun));
  });

  endLoading(parent);
}

function makeUpperLayer(parent, dispatcher, name, value) {
  if (!Number.isInteger(value)) {
    parent.select('#liquid').style('fill', 'none');
  } else if (value === 0) {
    // TODO: better manage the color
    parent.select('#liquid').style('fill', '#5dadec');
  } else {
    parent.select('#liquid').style('fill', getColor(value));
  }

  makeSticker(parent.select('.composition-box'), name, value);
}

const cfg = {
  field: 'supEu',
  max: 27,
};

const colorScale = scaleLinear()
  .domain([0, cfg.max])
  .interpolate(() => interpolateYlOrRd);

function getValue(ft) {
  if ('number' in ft.properties) {
    return ft.properties.number[cfg.field];
  }
  return null;
}
function getColor(value) {
  if (Number.isInteger(value)) {
    return colorScale(value);
  }
  return null;
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}

function makeBasis(parent) {
  const vpW = 1000;
  const vpH = 1000;

  const svg = parent
    .append('svg')
    .attr('viewBox', '0,0,' + vpW + ',' + vpH + '');

  const glass = svg.append('g').attr('id', 'svg-glass');
  const glassWidth = 300;
  const glassHeight = 300;
  makeSvgGlass(glass, glassWidth, glassHeight);
  glass.attr('transform', 'translate(400,700)');

  parent.append('div').classed('composition-box', true);
}

function makeSvgGlass(glass, width, height) {
  /* eslint-disable no-magic-numbers */
  const quarterWidth = width / 4;
  const thickness = width / 20;

  // glass
  glass
    .append('path')
    .attr('d', () => {
      const path = d3Path.path();
      path.moveTo(0, 0);
      path.lineTo(quarterWidth, height);
      path.lineTo(width - quarterWidth, height);
      path.lineTo(width, 0);
      path.closePath();
      return path.toString();
    })
    .style('fill', '#e7f3f8');

  // liquid
  glass
    .append('path')
    .attr('id', 'liquid')
    .attr('d', () => {
      const path = d3Path.path();
      path.moveTo(thickness, thickness);
      path.lineTo(quarterWidth + thickness, height - thickness);
      path.lineTo(width - quarterWidth - thickness, height - thickness);
      path.lineTo(width - thickness, thickness);
      path.closePath();
      return path.toString();
    })
    .style('fill', 'none');

  /* eslint-enable no-magic-numbers */
}
