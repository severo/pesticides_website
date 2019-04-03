import * as d3Path from 'd3-path';
const colorsList = {
  green: ['#007D73', '#006860'],
  purple: ['#8F0078', '#770064'],
  red: ['#c63400', '#A92B00'],
};
const dim = {
  he: 80,
  vHe: 1000,
  vWi: 400,
  wi: 36,
};
function getColors(colorName) {
  if (colorName in colorsList) {
    return colorsList[colorName];
  }
  return colorsList.red;
}

export function makeTubesCocktail(
  parent,
  substances,
  titleHtml,
  colorName,
  tubeClass
) {
  const preparedSubstances = substances
    // useless filter?
    .filter(subs => subs.max > 0)
    .sort((subs1, subs2) => {
      // alphabetic order to get some coherence and stability between views
      return subs1.substance.shortName.localeCompare(
        subs2.substance.shortName,
        'pt',
        {sensitivity: 'base'}
      );
    })
    .map(subs => {
      const numTests = subs.tests.length;
      const numDetections = subs.tests.filter(con => con > 0).length;
      const TO_PCT = 100;
      const DIGITS = 0;
      const ratio = numDetections / numTests;
      return {
        shortName: subs.substance.shortName,
        value: ratio,
        valueText:
          subs.substance.name +
          ' detected in ' +
          numDetections +
          ' of ' +
          numTests +
          ' measurements (' +
          (ratio * TO_PCT).toFixed(DIGITS) +
          '%)',
      };
    });

  const tubes = parent.append('div').classed('tubes', true);
  if (titleHtml !== '') {
    tubes.append('header').html(titleHtml);
  }

  const svg = tubes
    .selectAll('abbr')
    .data(preparedSubstances)
    .enter()
    // TODO: manage a popup for touch / mouseover, instead of this temporal attr
    .append('abbr')
    .attr('title', subs => subs.valueText)
    .append('svg')
    .classed('tube', true)
    .classed(tubeClass, true)
    .attr('width', dim.wi)
    .attr('height', dim.he)
    .attr('viewBox', '0,0,' + dim.vWi + ',' + dim.vHe + '');
  /* eslint-disable no-magic-numbers */

  drawTube(svg, 300, 1000).attr('transform', 'translate(100, 0)');
  drawLiquid(svg, 300, 1000, getColors(colorName)).attr(
    'transform',
    'translate(100, 0)'
  );
  drawText(svg, 300, 1000).attr(
    'transform',
    'scale(6) rotate(-90) translate(-10 16)'
  );
}

export function makeTubesLimits(parent, substances, titleHtml, color) {
  const preparedSubstances = substances
    .sort((subs1, subs2) => {
      // alphabetic order to get some coherence and stability between views
      return subs1.substance.shortName.localeCompare(
        subs2.substance.shortName,
        'pt',
        {sensitivity: 'base'}
      );
    })
    .map(subs => {
      // TODO: define which level to set in the tubes. Meanwhile: constant 100%
      const ratio = 1;
      return {
        shortName: subs.substance.shortName,
        value: ratio,
        valueText: subs.substance.name,
      };
    });

  const tubes = parent.append('div').classed('tubes', true);
  if (titleHtml !== '') {
    tubes.append('header').html(titleHtml);
  }

  const svg = tubes
    .selectAll('abbr')
    .data(preparedSubstances)
    .enter()
    // TODO: manage a popup for touch / mouseover, instead of this temporal attr
    .append('abbr')
    .attr('title', subs => subs.valueText)
    .append('svg')
    .attr('width', dim.wi)
    .attr('height', dim.he)
    .attr('viewBox', '0,0,' + dim.vWi + ',' + dim.vHe + '');
  /* eslint-disable no-magic-numbers */

  drawTube(svg, 300, 1000).attr('transform', 'translate(100, 0)');
  // TODO: find a way to automatically a pair of colors (color + darkened color)
  // instead of showing both sides with the same color
  // maybe "mix-blend-mod: darken", or SASS "darken"
  drawLiquid(svg, 300, 1000, [color, color]).attr(
    'transform',
    'translate(100, 0)'
  );
  drawText(svg, 300, 1000).attr(
    'transform',
    'scale(6) rotate(-90) translate(-10 16)'
  );
}

function drawTube(svg, width, height) {
  /* eslint-disable no-magic-numbers */

  const tube = svg.append('g');

  const wid = (1.5 * width) / 10;
  const hei = height - 3 * wid;
  const mid = width / 2;
  const colg_a = '#e7f3f8';
  const colg_b = '#bfdde3';
  const colg_c = '#cce8eb';
  const colg_d = '#b1d8df';

  const da = d3Path.path();
  da.rect(0, 0, mid, wid);
  tube
    .append('path')
    .attr('fill', colg_a)
    .attr('d', da.toString());

  const db = d3Path.path();
  db.rect(mid, 0, mid, wid);
  tube
    .append('path')
    .attr('fill', colg_b)
    .attr('d', db.toString());

  const dc = d3Path.path();
  dc.moveTo(wid, wid);
  dc.lineTo(wid, hei + wid);
  dc.quadraticCurveTo(wid, hei + 3 * wid, mid, hei + 3 * wid);
  dc.lineTo(mid, wid);
  dc.closePath();
  tube
    .append('path')
    .attr('fill', colg_c)
    .attr('d', dc.toString());

  const dd = d3Path.path();
  dd.moveTo(2 * mid - wid, wid);
  dd.lineTo(2 * mid - wid, hei + wid);
  dd.quadraticCurveTo(2 * mid - wid, hei + 3 * wid, mid, hei + 3 * wid);
  dd.lineTo(mid, wid);
  dd.closePath();
  tube
    .append('path')
    .attr('fill', colg_d)
    .attr('d', dd.toString());

  return tube;
  /* eslint-enable no-magic-numbers */
}

function drawLiquid(svg, width, height, colors) {
  /* eslint-disable no-magic-numbers */
  function getY(ratio, max, margin) {
    // Value must be between 0 and 1
    return max * (1 - ratio) + margin;
  }

  const liquid = svg.append('g').classed('liquid', true);
  const wid = (1.5 * width) / 10;
  const hei = height - 3 * wid;
  const mid = width / 2;

  const coll_a = colors[0];
  const coll_b = colors[1];

  liquid
    .append('path')
    .classed('right', true)
    .attr('fill', coll_a)
    .attr('d', subs => {
      const pesY = wid + getY(subs.value, hei - wid, wid);
      const dlb = d3Path.path();
      dlb.moveTo(2 * mid - 2 * wid, pesY);
      dlb.lineTo(2 * mid - 2 * wid, hei + wid);
      dlb.quadraticCurveTo(
        2 * mid - 2 * wid,
        hei + 2 * wid,
        mid,
        hei + 2 * wid
      );
      dlb.lineTo(mid, pesY);
      dlb.closePath();
      return dlb.toString();
    });
  liquid
    .append('path')
    .classed('left', true)
    .attr('fill', coll_b)
    .attr('d', subs => {
      const pesY = wid + getY(subs.value, hei - wid, wid);
      const dlb = d3Path.path();
      dlb.moveTo(2 * wid, pesY);
      dlb.lineTo(2 * wid, hei + wid);
      dlb.quadraticCurveTo(2 * wid, hei + 2 * wid, mid, hei + 2 * wid);
      dlb.lineTo(mid, pesY);
      dlb.closePath();
      return dlb.toString();
    });

  return liquid;
}
function drawText(svg, width, height) {
  /* eslint-disable no-magic-numbers */

  const name = svg.append('g');

  /*const wid = (1.5 * dim.vWi) / 10;
  const hei = dim.vHe - 3 * wid;
  const mid = dim.vWi / 2;*/

  name
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .style('text-anchor', 'end')
    .text(subs => subs.shortName);

  return name;
  /* eslint-enable no-magic-numbers */
}
