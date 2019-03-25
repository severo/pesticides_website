import * as d3Path from 'd3-path';
import {interpolateYlOrRd, scaleLinear} from 'd3';

export function makeBottle(parent, dispatcher, data) {
  startLoading(parent);

  makeBasis(parent);

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
  // TODO: compute the mean color for Brazil
  const fakeNum = 17;
  parent.select('svg #liquid').style('fill', colorScale(fakeNum));
  parent.select('svg #line2').text('Brazil');
  parent.select('svg #line3').text('');
  parent.select('svg #alert-sticker').style('fill', 'white');
  parent
    .select('svg #alert-sticker-text')
    .text(fakeNum + ' agrotoxic(s) included');
  parent.select('svg #liquid').style('fill', colorScale(fakeNum));
}

function makeForMun(parent, dispatcher, mun) {
  const lines = getLines(mun.properties.name);
  parent.select('svg #line2').text(lines[0]);
  if (lines[1].length > 0) {
    parent.select('svg #line3').text(lines[1]);
  } else {
    parent.select('svg #line3').text('');
  }

  if (Number.isInteger(value(mun))) {
    // TODO: differentiate when number == 0
    parent.select('svg #alert-sticker').style('fill', 'white');
    parent
      .select('svg #alert-sticker-text')
      .text(value(mun) + ' agrotoxic(s) included');
    parent.select('svg #liquid').style('fill', getColor(mun));
  } else {
    parent.select('svg #alert-sticker').style('fill', 'none');
    parent.select('svg #alert-sticker-text').text('');
    parent.select('svg #liquid').style('fill', 'none');
  }
}

function getLines(text) {
  // TODO: cut between words
  // eslint-disable-next-line no-magic-numbers
  return [text.slice(0, 10), text.slice(10, 20)];
}
const cfg = {
  field: 'supEu',
  max: 27,
};
const colorScale = scaleLinear()
  .domain([0, cfg.max])
  .interpolate(() => interpolateYlOrRd);
function value(ft) {
  if ('number' in ft.properties) {
    return ft.properties.number[cfg.field];
  }
  return null;
}
function getColor(ft) {
  if (Number.isInteger(value(ft))) {
    return colorScale(value(ft));
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

  const bottle = svg.append('g').attr('id', 'svg-bottle');
  const bottleWidth = 300;
  const bottleHeight = 1000;
  makeSvgBottle(bottle, bottleWidth, bottleHeight);
  bottle.attr('transform', 'translate(50,0)');

  const glass = svg.append('g').attr('id', 'svg-bottle');
  const glassWidth = 300;
  const glassHeight = 300;
  makeSvgGlass(glass, glassWidth, glassHeight);
  glass.attr('transform', 'translate(400,700)');
}

function makeSvgBottle(bottle, width, height) {
  /* eslint-disable no-magic-numbers */
  const midWidth = width / 2;
  const capWidth = width / 4;
  const capMidWidth = capWidth / 2;
  const capHeight = height / 20;
  const bodyWidth = width;
  const bodyHeight = height - capHeight;
  const mainStickerWidth = width;
  const mainStickerHeight = height / 5;
  const mainStickerYPosition = (2 * height) / 5;
  const alertStickerWidth = width;
  const alertStickerHeight = height / 10;
  const alertStickerYPosition =
    mainStickerYPosition + mainStickerHeight + height / 20;
  const mainStickerTextYPosition = mainStickerYPosition + height / 20;
  const line2Y = height / 20;
  const line3Y = line2Y + height / 20;
  const alertStickerTextYPosition = alertStickerYPosition + height / 20;

  // cap
  bottle
    .append('path')
    .attr('d', () => {
      const path = d3Path.path();
      path.rect(0, 0, capWidth, capHeight);
      return path.toString();
    })
    .attr('transform', 'translate(' + (midWidth - capMidWidth) + ' 0)')
    .style('fill', '#e7f3f8');

  // body
  bottle
    .append('path')
    .attr('d', () => {
      const path = d3Path.path();
      path.rect(0, 0, bodyWidth, bodyHeight);
      return path.toString();
    })
    .attr('transform', 'translate(0 ' + capHeight + ')')
    .style('fill', '#e7f3f8');

  // main sticker
  bottle
    .append('path')
    .attr('d', () => {
      const path = d3Path.path();
      path.rect(0, 0, mainStickerWidth, mainStickerHeight);
      return path.toString();
    })
    .attr('transform', 'translate(0 ' + mainStickerYPosition + ')')
    .style('fill', 'white');

  // text on main sticker
  const mainStickerText = bottle.append('g').attr('id', 'main-sticker-text');
  mainStickerText
    .append('text')
    .attr('id', 'line1')
    .attr('text-anchor', 'middle')
    .text('Water of');
  mainStickerText
    .append('text')
    .attr('id', 'line2')
    .attr('text-anchor', 'middle')
    .attr('y', line2Y)
    .text('');
  mainStickerText
    .append('text')
    .attr('id', 'line3')
    .attr('text-anchor', 'middle')
    .attr('y', line3Y)
    .text('');
  mainStickerText.attr(
    'transform',
    'translate(' + midWidth + ' ' + mainStickerTextYPosition + ')'
  );

  // alert sticker
  bottle
    .append('path')
    .attr('id', 'alert-sticker')
    .attr('d', () => {
      const path = d3Path.path();
      path.rect(0, 0, alertStickerWidth, alertStickerHeight);
      return path.toString();
    })
    .attr('transform', 'translate(0 ' + alertStickerYPosition + ')')
    .style('fill', 'none');

  // text on main sticker
  const alertStickerText = bottle
    .append('text')
    .attr('id', 'alert-sticker-text')
    .attr('text-anchor', 'middle')
    .text('');
  alertStickerText.attr(
    'transform',
    'translate(' + midWidth + ' ' + alertStickerTextYPosition + ')'
  );

  /* eslint-enable no-magic-numbers */
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
