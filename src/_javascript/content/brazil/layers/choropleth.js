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
  number: {
    field: 'supEu',
    max: 27,
    mouseoutCallbackTypename: 'choropleth-mouseout',
    mouseoverCallbackTypename: 'choropleth-mouseover',
  },
};

export function createChoropleth(parent, data, path, view, dispatcher) {
  const field = cfg[view].field;
  const max = cfg[view].max;
  function value(ft) {
    if (view in ft.properties) {
      return ft.properties[view][field];
    }
    return null;
  }
  parent
    .append('g')
    .classed('choropleth', true)
    .classed(view, true)
    .selectAll('path')
    .data(data.mun.features)
    .enter()
    .append('path')
    .attr('id', ft => 'id-' + ft.properties.ibgeCode)
    .attr('d', ft => path(ft.geometry))
    .style('fill', ft => {
      if (Number.isInteger(value(ft))) {
        return interpolateYlOrRd(value(ft) / max);
      }
      return null;
    })
    .on('mouseover', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg[view].mouseoverCallbackTypename, null, {
        properties: ft.properties,
        value: value(ft),
      });
    })
    .on('mouseout', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg[view].mouseoutCallbackTypename);
    });
}
