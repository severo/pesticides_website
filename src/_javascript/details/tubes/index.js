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

export function makeTubes(parent, name, mun, data) {
  const DETECTED_VALUE = 1e-10;

  const substances = mun.properties.tests
    .filter(subs => subs.max > 0)
    .sort((subs1, subs2) => {
      // alphabetic order to get some coherence and stability between views
      return subs1.substance.shortName > subs2.substance.shortName;
    })
    .map(subs => {
      return {
        limit: subs.substance.limit,
        name: subs.substance.name,
        shortName: subs.substance.shortName,
        value: subs.max,
        valueText:
          subs.max === DETECTED_VALUE
            ? 'detected'
            : subs.max.toLocaleString('pt-BR') +
              ' μg/L (legal limit: ' +
              subs.substance.limit.toLocaleString('pt-BR') +
              ' μg/L)',
      };
    });

  const tubes = parent.append('div').classed('tubes', true);

  const svg = tubes
    .selectAll('abbr')
    .data(substances)
    .enter()
    .append('abbr')
    .attr('title', subs => subs.name + ' - ' + subs.valueText)
    .append('svg')
    .attr('width', dim.wi)
    .attr('height', dim.he)
    .attr('viewBox', '0,0,' + dim.vWi + ',' + dim.vHe + '');
  /* eslint-disable no-magic-numbers */

  drawTube(svg, 300, 1000).attr('transform', 'translate(100, 0)');
  drawLiquid(svg, 300, 1000).attr('transform', 'translate(100, 0)');
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

function drawLiquid(svg, width, height) {
  /* eslint-disable no-magic-numbers */
  function getY(value, limit) {
    // Hand made limits. We lose the exact proportions, but avoid exagerated
    // bars
    const min = 0.1;
    const max = 0.95;
    const limitFactor = 0.75;
    let ratio = (limitFactor * value) / limit;
    if (ratio > max) {
      ratio = max;
    } else if (ratio < min) {
      ratio = min;
    }
    return 1 - ratio;
  }

  const colors = colorsList.red;
  const liquid = svg.append('g');

  const wid = (1.5 * width) / 10;
  const hei = height - 3 * wid;
  const mid = width / 2;

  const coll_a = colors[0];
  const coll_b = colors[1];

  liquid
    .append('path')
    .attr('fill', coll_a)
    .attr('d', subs => {
      const pesY = wid + getY(subs.value, subs.limit) * hei;
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
    .attr('fill', coll_b)
    .attr('d', subs => {
      const pesY = wid + getY(subs.value, subs.limit) * hei;
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
