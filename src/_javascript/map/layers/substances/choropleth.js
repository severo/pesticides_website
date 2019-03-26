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
  legend: {
    height: 10,
    subtitleOffset: 8,
    tickSize: 15,
    titleOffset: 22,
    width: 270,
  },
  typename: {
    click: 'mun-click',
    mouseout: 'mun-mouseout',
    mouseover: 'mun-mouseover',
  },
};

export function createSubstancesChoropleth(
  parent,
  path,
  data,
  dispatcher,
  substance
) {
  // TODO - avoid outliers setting a cap on max Concentration to substance limit
  // or about (2x, 3x)
  const maxConcentration = data.mun.features.reduce((acc, ft) => {
    if (value(ft, substance.code) && value(ft, substance.code) > acc) {
      acc = value(ft, substance.code);
    }
    return acc;
  }, 0);

  const color = scaleLinear()
    .domain([0, maxConcentration])
    .interpolate(() => interpolateYlOrRd);

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
      // TODO - We use 1e-10 to encode not-quantized - it's the same visual
      //  encoding as no detection - we should make it better
      if (value(ft, substance.code) && value(ft, substance.code) >= 0) {
        return color(value(ft, substance.code));
      }
      return null;
    })
    .on('mouseover', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg.typename.mouseover, null, {
        properties: ft.properties,
        value: value(ft, substance.code),
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
  makeLegend(parent, maxConcentration, color, substance.shortName);
}

function value(ft, code) {
  // TODO - suboptimal, it would be simpler (and quicker?) with a lookup table
  if ('tests' in ft.properties) {
    const subst = ft.properties.tests.filter(
      sub => sub.substance.code === code
    );
    if (subst.length === 1) {
      return subst[0].max;
    }
    return null;
  }
  return null;
}

function makeLegend(parent, maxConcentration, color, name) {
  // TODO: should be a scheme (27 colors), not a continuous scale
  const xx = scaleLinear()
    .domain(color.domain())
    .rangeRound([0, cfg.legend.width]);

  const legend = parent
    .append('g')
    //.style('font-size', '0.8rem')
    //.style('font-family', 'sans-serif')
    .attr('transform', 'translate(550,50)');

  legend
    .selectAll('rect')
    .data(range(0, maxConcentration, 1))
    .enter()
    .append('rect')
    .attr('height', cfg.legend.height)
    .attr('x', el => xx(el))
    .attr('width', cfg.legend.width / maxConcentration)
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
    .text('Max detected concentration of ' + name);

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legend.subtitleOffset)
    .text(
      '(white: no detection, purple: ' +
        maxConcentration.toLocaleString('pt-BR') +
        ' μg/L)'
    );

  // Scale
  legend
    .append('g')
    .call(axisBottom(xx).tickSize(cfg.legend.tickSize))
    .select('.domain')
    .remove();
}
