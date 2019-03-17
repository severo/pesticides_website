import {interpolateYlOrRd} from 'd3';

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
  field: 'supEu',
  max: 27,
  typename: {
    click: 'mun-click',
    mouseout: 'mun-mouseout',
    mouseover: 'mun-mouseover',
  },
};

export function createChoropleth(parent, path, data, dispatcher) {
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
        return interpolateYlOrRd(value(ft) / cfg.max);
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
      dispatcher.call(cfg.typename.click);
    });
}

function value(ft) {
  if ('number' in ft.properties) {
    return ft.properties.number[cfg.field];
  }
  return null;
}
