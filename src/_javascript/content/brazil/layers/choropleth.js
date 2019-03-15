import {interpolateYlOrRd} from 'd3';

const cfg = {number: {hoverCallbackTypename: 'number-hover', maxValue: 27}};

export function createChoropleth(
  parent,
  geometries,
  statistics,
  path,
  view,
  dispatcher
) {
  const ibgeCodeLength = 6;
  const data = geometries.municipalities.features.map(mun => {
    return {
      geom: mun.geometry,
      id: mun.properties.geocodigo.slice(0, ibgeCodeLength),
      value: getValue(statistics, mun.properties.ibgeCode),
    };
  });
  parent
    .append('g')
    .classed('choropleth', true)
    .classed(view, true)
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('id', mun => mun.id)
    .attr('d', mun => path(mun.geom))
    .style('fill', mun => getFill(mun.value, view))
    .on('mouseover', mun => {
      // invoke callbacks
      dispatcher.call(cfg[view].hoverCallbackTypename, null, mun);
    });
}

function getValue(statistics, ibgeCode) {
  if (ibgeCode in statistics) {
    return statistics[ibgeCode].detected;
  }
  return null;
}

function getFill(value, view) {
  if (value) {
    return interpolateYlOrRd(value / cfg[view].maxValue);
  }
  return null;
}