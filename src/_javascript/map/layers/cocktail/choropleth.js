import {axisBottom, interpolateYlOrRd, range, scaleLinear} from 'd3';

// TODO: add a control to select the parameter?
/* Reminder of the data available from the CSV
category: {
  atrAvgCat: row.atrazine_atrazine_category,
  atrMaxCat: row.atrazine_category,
  ibgeBode: row.ibge_code,
  simAvgCat: row.simazine_atrazina_category,
  simMaxCat: row.simazine_category,
},
number: {
  detected: +row.detected,
  eqBr: +row.eq_br,
  supBr: +row.sup_br,
  supEu: +row.sup_eu,
},
*/
const cfg = {
  field: 'detected',
  legend: {
    height: 10,
    subtitleOffset: 8,
    tickSize: 15,
    titleOffset: 22,
    width: 10,
  },
  max: 27,
  typename: {
    click: 'mun-click-cocktail',
    mouseout: 'mun-mouseout-cocktail',
    mouseover: 'mun-mouseover-cocktail',
  },
};

export function createCocktailChoropleth(parent, path, data, dispatcher) {
  parent
    .append('g')
    .classed('choropleth', true)
    .selectAll('path')
    .data(data.mun.features)
    .enter()
    .append('path')
    .attr('id', ft => 'id-' + ft.properties.ibgeCode)
    .attr('d', path)
    .style('fill', ft => {
      if (Number.isInteger(value(ft))) {
        return color(value(ft));
      }
      return null;
    })
    .on('mouseover', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg.typename.mouseover, null, {
        properties: ft.properties,
        value: value(ft),
      });
    })
    .on('mouseout', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg.typename.mouseout);
    })
    .on('click', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg.typename.click, null, ft);
    });
  makeLegend(parent);
}

function value(ft) {
  if ('number' in ft.properties) {
    return ft.properties.number[cfg.field];
  }
  return null;
}

const color = scaleLinear()
  .domain([0, cfg.max])
  .interpolate(() => interpolateYlOrRd);

function makeLegend(parent) {
  // TODO: should be a scheme (27 colors), not a continuous scale
  const xx = scaleLinear()
    .domain(color.domain())
    .rangeRound([0, cfg.legend.width * cfg.max]);

  const legend = parent
    .append('g')
    //.style('font-size', '0.8rem')
    //.style('font-family', 'sans-serif')
    .attr('transform', 'translate(550,50)');

  legend
    .selectAll('rect')
    .data(range(0, cfg.max, 1))
    .enter()
    .append('rect')
    .attr('height', cfg.legend.height)
    .attr('x', el => xx(el))
    .attr('width', cfg.legend.width)
    .attr('fill', el => color(el));

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legend.titleOffset)
    .attr('font-weight', 'bold')
    .text('Number of pesticides detected in drinking water');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legend.subtitleOffset)
    .text('(white: no pesticide, purple: 27 different pesticides)');

  // Scale
  legend
    .append('g')
    .call(axisBottom(xx).tickSize(cfg.legend.tickSize))
    .select('.domain')
    .remove();
}
