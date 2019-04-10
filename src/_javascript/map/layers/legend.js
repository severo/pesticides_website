import {axisBottom, range, scaleLinear} from 'd3';
import {MAP2} from '../../data';
import {cocktailColor} from './choropleth';

const cfg = {
  legendCocktail: {
    height: 10,
    subtitleOffset: 8,
    tickSize: 15,
    titleOffsetLine1: 38,
    titleOffsetLine2: 24,
    width: 10,
  },
  legendLimits: {
    height: 20,
    label: {xOffset: 30, yOffset: 15},
    subtitleOffset: 8,
    titleOffset: 22,
    width: 20,
  },
  max: 27,
};

const legendKeys = ['SUP_BR', 'SUP_EU', 'BELOW', 'NO_TEST'];

const legendLabels = {
  BELOW: '{{map.legend.limits.BELOW}}',
  NO_TEST: '{{map.legend.limits.NO_TEST}}',
  SUP_BR: '{{map.legend.limits.SUP_BR}}',
  SUP_EU: '{{map.legend.limits.SUP_EU}}',
};

export function createLegend(parent, dispatcher) {
  dispatcher.on('make-app-cocktail.legend', () => createLegendCocktail(parent));
  dispatcher.on('make-app-limits.legend', () => createLegendLimits(parent));
}

function createLegendCocktail(parent) {
  parent.selectAll('g.legend').html(null);
  // TODO: should be a scheme (27 colors), not a continuous scale
  const xx = scaleLinear()
    .domain([0, cfg.max])
    .rangeRound([0, cfg.legendCocktail.width * cfg.max]);

  const legend = parent
    .append('g')
    .classed('legend', true)
    //.style('font-size', '0.8rem')
    //.style('font-family', 'sans-serif')
    .attr('transform', 'translate(550,66) scale(1.3)');

  legend
    .selectAll('rect')
    .data(range(0, cfg.max, 1))
    .enter()
    .append('rect')
    .attr('height', cfg.legendCocktail.height)
    .attr('x', el => xx(el))
    .attr('width', cfg.legendCocktail.width)
    .attr('fill', el => cocktailColor(el));

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legendCocktail.titleOffsetLine1)
    .attr('font-weight', 'bold')
    .text('{{map.legend.cocktail1}}');

  label
    .append('text')
    .attr('y', -cfg.legendCocktail.titleOffsetLine2)
    .attr('font-weight', 'bold')
    .text('{{map.legend.cocktail2}}');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legendCocktail.subtitleOffset)
    .text('{{map.legend.cocktail3}}');

  // Scale
  legend
    .append('g')
    .call(axisBottom(xx).tickSize(cfg.legendCocktail.tickSize))
    .select('.domain')
    .remove();
}

function createLegendLimits(parent) {
  parent.selectAll('g.legend').html(null);

  const yy = scaleLinear()
    .domain([0, legendKeys.length])
    .rangeRound([0, cfg.legendLimits.height * legendKeys.length]);

  const legend = parent
    .append('g')
    .classed('legend', true)
    //.style('font-size', '0.8rem')
    //.style('font-family', 'sans-serif')
    .attr('transform', 'translate(550,50) scale(1.3)');

  legend
    .selectAll('rect')
    .data(legendKeys)
    .enter()
    .append('rect')
    .attr('class', key => 'cat-' + MAP2.CATEGORY[key])
    .attr('height', cfg.legendLimits.height)
    .attr('y', (key, idx) => yy(idx))
    .attr('width', cfg.legendLimits.width);

  legend
    .selectAll('text')
    .data(legendKeys)
    .enter()
    .append('text')
    .attr('x', cfg.legendLimits.label.xOffset)
    .attr('y', (key, idx) => yy(idx) + cfg.legendLimits.label.yOffset)
    .text(key => legendLabels[key]);

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legendLimits.titleOffset)
    .attr('font-weight', 'bold')
    .text('{{map.legend.limits1}}');
  label
    .append('text')
    .attr('y', -cfg.legendLimits.subtitleOffset)
    .attr('font-weight', 'bold')
    .text('{{map.legend.limits2}}');
}
