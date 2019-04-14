import * as d3Path from 'd3-path';
const dim = {
  he: 100,
  vHe: 1000,
  vWi: 1100,
  wi: 100,
};

export function makeTubesCocktail(parent, substances, titleHtml, tubeClass) {
  const preparedSubstances = substances
    // useless filter?
    .filter(subs => subs.max > 0)
    .sort((subs1, subs2) => {
      // alphabetic order to get some coherence and stability between views
      return subs1.substance.shortName.localeCompare(
        subs2.substance.shortName,
        '{{locale}}',
        {sensitivity: 'base'}
      );
    })
    .map(sub => {
      const numTests = sub.tests.length;
      const numDetections = sub.tests.filter(con => con > 0).length;
      const ratio = numDetections / numTests;
      return {
        numDetections: numDetections,
        numTests: numTests,
        shortName: sub.substance.shortName,
        url: sub.substance.url,
        value: ratio,
      };
    });

  const tubes = parent.append('div').classed('tubes', true);
  if (titleHtml !== '') {
    tubes.append('header').html(titleHtml);
  }

  const svg = tubes
    .selectAll('svg')
    .data(preparedSubstances)
    .enter()
    .append('svg')
    .classed('tube', true)
    .classed(tubeClass, true)
    .attr('width', dim.wi)
    .attr('height', dim.he)
    .attr('viewBox', '0,0,' + dim.vWi + ',' + dim.vHe + '');
  /* eslint-disable no-magic-numbers */

  const dyTube = 0;
  const params = getLiquidParams(250, 800);
  drawTube(svg, 250, 800).attr('transform', 'translate(0, ' + dyTube + ')');
  drawLiquid(svg, 250, 800).attr('transform', 'translate(0, ' + dyTube + ')');

  const dyName = 980;
  svg
    .append('a')
    .attr('href', sub => sub.url)
    .attr('target', '_blank')
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('transform', 'translate(' + params.wid + ', ' + dyName + ') scale(5)')
    .style('text-anchor', 'start')
    .text(subs => subs.shortName);

  const text = svg
    .append('text')
    .classed('annotation', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr(
      'transform',
      sub =>
        'translate(300, ' + (dyTube + params.getY(sub.value)) + ') scale(4)'
    )
    .style('text-anchor', 'start');
  text
    .append('tspan')
    .attr('x', '0')
    .attr('dy', '0')
    .text(sub => sub.numDetections + '{{details.cocktail.tubes.tube1}}');
  text
    .append('tspan')
    .attr('x', '0')
    .attr('dy', '1.2em')
    .text(
      sub =>
        '{{details.cocktail.tubes.tube2}}' +
        sub.numTests +
        '{{details.cocktail.tubes.tube3}}'
    );
}

export function makeTubesLimits(parent, substances, titleHtml, tubeClass) {
  const preparedSubstances = substances
    .sort((subs1, subs2) => {
      // alphabetic order to get some coherence and stability between views
      return subs1.substance.shortName.localeCompare(
        subs2.substance.shortName,
        '{{locale}}',
        {sensitivity: 'base'}
      );
    })
    .map(subs => {
      // TODO: define which level to set in the tubes. Meanwhile: constant 100%
      const ratio = 1;
      return {
        shortName: subs.substance.shortName,
        url: subs.substance.url,
        value: ratio,
        //valueText: subs.substance.name,
      };
    });

  const tubes = parent.append('div').classed('tubes', true);
  if (titleHtml !== '') {
    tubes.append('header').html(titleHtml);
  }

  const svg = tubes
    .selectAll('svg')
    .data(preparedSubstances)
    .enter()
    // TODO: manage a popup for touch / mouseover, instead of this temporal attr
    //.append('abbr')
    //.attr('title', subs => subs.valueText)
    .append('svg')
    .classed('tube', true)
    .classed(tubeClass, true)
    .attr('width', dim.wi)
    .attr('height', dim.he)
    .attr('viewBox', '0,0,' + dim.vWi + ',' + dim.vHe + '');
  /* eslint-disable no-magic-numbers */

  drawTube(svg, 250, 800).attr('transform', 'translate(375, 0)');
  drawLiquid(svg, 250, 800).attr('transform', 'translate(375, 0)');
  drawText(
    svg
      .append('a')
      .attr('href', sub => sub.url)
      .attr('target', '_blank')
  ).attr('transform', 'scale(5) translate(102 190)');
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

function getLiquidParams(width, height) {
  /* eslint-disable no-magic-numbers */
  const wid = (1.5 * width) / 10;
  const hei = height - 3 * wid;
  const max = hei - wid;
  const margin = 2 * wid;
  function getY(ratio) {
    // Ratio must be between 0 (empty) and 1 (full)
    return max * (1 - ratio) + margin;
  }
  return {
    getY: getY,
    hei: hei,
    mid: width / 2,
    wid: wid,
  };
  /* eslint-enable no-magic-numbers */
}

function drawLiquid(svg, width, height) {
  /* eslint-disable no-magic-numbers */

  const liquid = svg.append('g').classed('liquid', true);
  const params = getLiquidParams(width, height);

  liquid
    .append('path')
    .classed('right', true)
    .attr('d', sub => {
      const pesY = params.getY(sub.value) + params.wid;
      const dlb = d3Path.path();
      dlb.moveTo(2 * params.mid - 2 * params.wid, pesY);
      dlb.lineTo(2 * params.mid - 2 * params.wid, params.hei + params.wid);
      dlb.quadraticCurveTo(
        2 * params.mid - 2 * params.wid,
        params.hei + 2 * params.wid,
        params.mid,
        params.hei + 2 * params.wid
      );
      dlb.lineTo(params.mid, pesY);
      dlb.closePath();
      return dlb.toString();
    });
  liquid
    .append('path')
    .classed('left', true)
    .attr('d', sub => {
      const pesY = params.getY(sub.value) + params.wid;
      const dlb = d3Path.path();
      dlb.moveTo(2 * params.wid, pesY);
      dlb.lineTo(2 * params.wid, params.hei + params.wid);
      dlb.quadraticCurveTo(
        2 * params.wid,
        params.hei + 2 * params.wid,
        params.mid,
        params.hei + 2 * params.wid
      );
      dlb.lineTo(params.mid, pesY);
      dlb.closePath();
      return dlb.toString();
    });

  return liquid;
}
function drawText(svg) {
  /* eslint-disable no-magic-numbers */

  const name = svg.append('g');

  /*const wid = (1.5 * dim.vWi) / 10;
  const hei = dim.vHe - 3 * wid;
  const mid = dim.vWi / 2;*/

  name
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .style('text-anchor', 'middle')
    .text(subs => subs.shortName);

  return name;
  /* eslint-enable no-magic-numbers */
}
