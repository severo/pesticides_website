import {MAP1, MAP2} from '../../data';
import {cocktailColor, limitsColor} from './choropleth';
import {scaleLinear} from 'd3';
//import {axisBottom, range, scaleLinear} from 'd3';

const cfg = {
  cocktail: {
    dim: {
      /*height: 10,
    subtitleOffset: 8,
    tickSize: 15,
    titleOffsetLine1: 38,
    titleOffsetLine2: 24,
    width: 10,*/
      height: 16,
      label: {xOffset: 30, yOffset: 15},
      margin: 4,
      subtitleOffset: 8,
      titleOffset: 26,
      width: 16,
    },
    keys: ['CAT_4', 'CAT_3', 'CAT_2', 'CAT_1', 'NO_TEST'],
    labels: {
      CAT_1: '{{map.legend.cocktail.CAT_1}}',
      CAT_2: '{{map.legend.cocktail.CAT_2}}',
      CAT_3: '{{map.legend.cocktail.CAT_3}}',
      CAT_4: '{{map.legend.cocktail.CAT_4}}',
      NO_TEST: '{{map.legend.cocktail.NO_TEST}}',
    },
  },
  limits: {
    dim: {
      height: 16,
      label: {xOffset: 30, yOffset: 15},
      margin: 4,
      subtitleOffset: 8,
      titleOffset: 26,
      width: 16,
    },
    keys: ['SUP_BR', 'SUP_EU', 'BELOW', 'NO_TEST'],
    labels: {
      BELOW: '{{map.legend.limits.BELOW}}',
      NO_TEST: '{{map.legend.limits.NO_TEST}}',
      SUP_BR: '{{map.legend.limits.SUP_BR}}',
      SUP_EU: '{{map.legend.limits.SUP_EU}}',
    },
  },
  max: 27,
};

export function createLegend(parent, dispatcher) {
  dispatcher.on('make-app-cocktail.legend', () => createLegendCocktail(parent));
  dispatcher.on('make-app-limits.legend', () => createLegendLimits(parent));
}
/*
function createLegendCocktail(parent) {
  parent.selectAll('g.legend').html(null);
  // TODO: should be a scheme (27 colors), not a continuous scale
  const xx = scaleLinear()
    .domain([0, cfg.max])
    .rangeRound([0, cfg.cocktail.dim.width * cfg.max]);

  const legend = parent
    .append('g')
    .classed('legend', true)
    //.style('font-size', '0.8rem')
    //.style('font-family', 'sans-serif')
    .attr('transform', 'translate(530,66) scale(1.3)');

  legend
    .selectAll('rect')
    .data(range(0, cfg.max, 1))
    .enter()
    .append('rect')
    .attr('height', cfg.cocktail.dim.height)
    .attr('x', el => xx(el))
    .attr('width', cfg.cocktail.dim.width)
    .attr('fill', el => cocktailColor(el));

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.cocktail.dim.titleOffsetLine1)
    .attr('font-weight', 'bold')
    .text('{{map.legend.cocktail1}}');

  label
    .append('text')
    .attr('y', -cfg.cocktail.dim.titleOffsetLine2)
    .attr('font-weight', 'bold')
    .text('{{map.legend.cocktail2}}');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.cocktail.dim.subtitleOffset)
    .attr('font-size', '0.9rem')
    .text('{{map.legend.cocktail3}}');

  // Scale
  legend
    .append('g')
    .call(axisBottom(xx).tickSize(cfg.cocktail.dim.tickSize))
    .select('.domain')
    .remove();
}
*/
function createLegendCocktail(parent) {
  parent.selectAll('g.legend').html(null);

  const yy = scaleLinear()
    .domain([0, cfg.cocktail.keys.length])
    .rangeRound([
      0,
      (cfg.cocktail.dim.height + cfg.cocktail.dim.margin) *
        cfg.cocktail.keys.length,
    ]);

  // All the dimensions here work, but are somewhat arbitrary and maybe fragile
  // TODO: strict control on dimensions
  const viewportWidth = 960;
  const dx = 680;
  const width = viewportWidth - dx;
  const textHeight = 66;

  const legend = parent
    .append('g')
    .classed('legend', true)
    .attr('transform', 'translate(' + dx + ',' + textHeight + ') scale(1.3)');

  // white background
  legend
    .append('rect')
    .attr('width', width)
    .attr(
      'height',
      (cfg.cocktail.dim.height + cfg.cocktail.dim.margin + 1) *
        cfg.cocktail.keys.length +
        textHeight -
        1
    )
    .attr('x', '-8')
    .attr('y', -textHeight)
    .style('fill', 'white')
    .style('stroke', 'none');

  const values = legend.append('g');
  values
    .selectAll('rect')
    .data(cfg.cocktail.keys)
    .enter()
    .append('rect')
    .attr('fill', key => cocktailColor(MAP1.CATEGORY[key]))
    .attr('height', cfg.cocktail.dim.height)
    .attr('x', 0)
    .attr('y', (key, idx) => yy(idx))
    .attr('width', cfg.cocktail.dim.width);

  values
    .selectAll('text')
    .data(cfg.cocktail.keys)
    .enter()
    .append('text')
    .attr('x', cfg.cocktail.dim.label.xOffset)
    .attr('y', (key, idx) => yy(idx) + cfg.cocktail.dim.label.yOffset)
    .attr('font-size', '0.9rem')
    .text(key => cfg.cocktail.labels[key]);

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.cocktail.dim.titleOffset)
    .attr('font-weight', 'bold')
    .text('{{map.legend.cocktail1}}');
  label
    .append('text')
    .attr('y', -cfg.cocktail.dim.subtitleOffset)
    .attr('font-weight', 'bold')
    .text('{{map.legend.cocktail2}}');
}

function createLegendLimits(parent) {
  parent.selectAll('g.legend').html(null);

  const yy = scaleLinear()
    .domain([0, cfg.limits.keys.length])
    .rangeRound([
      0,
      (cfg.limits.dim.height + cfg.limits.dim.margin) * cfg.limits.keys.length,
    ]);

  // All the dimensions here work, but are somewhat arbitrary and maybe fragile
  // TODO: strict control on dimensions
  const viewportWidth = 960;
  const dx = 550;
  const width = viewportWidth - dx;
  const textHeight = 50;

  const legend = parent
    .append('g')
    .classed('legend', true)
    .attr('transform', 'translate(' + dx + ',' + textHeight + ') scale(1.3)');

  // white background
  legend
    .append('rect')
    .attr('width', width)
    .attr(
      'height',
      (cfg.limits.dim.height + cfg.limits.dim.margin + 1) *
        cfg.limits.keys.length +
        textHeight -
        1
    )
    .attr('x', '-8')
    .attr('y', -textHeight)
    .style('fill', 'white')
    .style('stroke', 'none');

  const values = legend.append('g');

  values
    .selectAll('rect')
    .data(cfg.limits.keys)
    .enter()
    .append('rect')
    .attr('fill', key => limitsColor(MAP2.CATEGORY[key]))
    .attr('height', cfg.limits.dim.height)
    .attr('y', (key, idx) => yy(idx))
    .attr('width', cfg.limits.dim.width);

  values
    .selectAll('text')
    .data(cfg.limits.keys)
    .enter()
    .append('text')
    .attr('x', cfg.limits.dim.label.xOffset)
    .attr('y', (key, idx) => yy(idx) + cfg.limits.dim.label.yOffset)
    .attr('font-size', '0.9rem')
    .text(key => cfg.limits.labels[key]);

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.limits.dim.titleOffset)
    .attr('font-weight', 'bold')
    .text('{{map.legend.limits1}}');
  label
    .append('text')
    .attr('y', -cfg.limits.dim.subtitleOffset)
    .attr('font-weight', 'bold')
    .text('{{map.legend.limits2}}');
}
