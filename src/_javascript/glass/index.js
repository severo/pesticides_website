import * as d3Path from 'd3-path';
import {interpolateYlOrRd, scaleLinear} from 'd3';
import {makeSticker} from './sticker';

export function makeGlass(parent, dispatcher, data) {
  startLoading(parent);

  const substances = data.substances;
  makeBasis(parent);

  // Init
  // TODO: compute the mean color for Brazil
  const fakeNum = 17;
  makeUpperLayer(parent, dispatcher, 'Brazil', fakeNum, substances, {});

  dispatcher.on('to-brazil-view.glass', brazilData => {
    makeUpperLayer(parent, dispatcher, 'Brazil', fakeNum, substances, {});
  });

  dispatcher.on('to-mun-view.glass', mun => {
    makeUpperLayer(
      parent,
      dispatcher,
      mun.properties.name,
      getValue(mun),
      substances,
      mun
    );
  });

  endLoading(parent);
}

function makeUpperLayer(parent, dispatcher, name, value, substances, mun) {
  if (!Number.isInteger(value)) {
    parent
      .select('header.header')
      .html('No data about agrotoxics inside drinking water in ' + name + '.');
    parent.select('#droplet').style('fill', '#eee');
    parent.select('#liquid').style('fill', '#eee');
    parent.select('#composition-box').classed('is-hidden', true);
  } else if (value === 0) {
    // TODO: better manage the color
    parent
      .select('header.header')
      .html('No agrotoxics detected inside drinking water in ' + name + '.');
    parent.select('#droplet').style('fill', '#5dadec');
    parent.select('#liquid').style('fill', '#5dadec');
    parent.select('#composition-box').classed('is-hidden', false);
  } else {
    parent
      .select('header.header')
      .html(
        'The drinking water in ' +
          name +
          ' contains <strong>' +
          value +
          ' different agrotoxics</strong>.'
      );
    parent.select('#droplet').style('fill', getColor(value));
    parent.select('#liquid').style('fill', getColor(value));
    parent.select('#composition-box').classed('is-hidden', false);
  }

  makeSticker(parent.select('#composition-box'), name, value, substances, mun);
}

const cfg = {
  field: 'detected',
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
  parent.append('header').classed('header', true);

  const vpW = 1000;
  const vpH = 500;
  const svg = parent
    .append('svg')
    .attr('viewBox', '0,0,' + vpW + ',' + vpH + '');

  const droplet = svg.append('g').attr('id', 'svg-droplet');
  makeSvgDroplet(droplet);
  droplet.attr('transform', 'translate(455,30) scale(3)');

  const glass = svg.append('g').attr('id', 'svg-glass');
  const glassWidth = 300;
  const glassHeight = 300;
  makeSvgGlass(glass, glassWidth, glassHeight);
  glass.attr('transform', 'translate(350,200)');

  parent.append('div').attr('id', 'composition-box');
}

function makeSvgDroplet(droplet) {
  /* eslint-disable no-magic-numbers */
  // droplet - see https://stackoverflow.com/a/30712432/7351594
  droplet.html(
    `<path
      id="droplet"
      d="M15 3
           Q16.5 6.8 25 18
           A12.8 12.8 0 1 1 5 18
           Q13.5 6.8 15 3z"
    />`
  );
  /* eslint-enable no-magic-numbers */
}
function makeSvgGlass(glass, width, height) {
  /* eslint-disable no-magic-numbers */
  const qWidth = width / 4;
  const qqWidth = qWidth / 4;
  const qHeight = height / 4;
  const thickness = width / 20;

  // glass
  glass
    .append('path')
    .attr('d', () => {
      const path = d3Path.path();
      path.moveTo(0, 0);
      path.lineTo(qWidth, height);
      path.lineTo(width - qWidth, height);
      path.lineTo(width, 0);
      path.closePath();
      return path.toString();
    })
    .style('fill', '#d5e5f2'); //'#e7f3f8');

  // liquid
  glass
    .append('path')
    .attr('id', 'liquid')
    .attr('d', () => {
      const path = d3Path.path();
      path.moveTo(qqWidth + thickness, qHeight);
      path.lineTo(qWidth + thickness, height - thickness);
      path.lineTo(width - qWidth - thickness, height - thickness);
      path.lineTo(width - qqWidth - thickness, qHeight);
      path.closePath();
      return path.toString();
    })
    .style('fill', 'none');

  /* eslint-enable no-magic-numbers */
}
