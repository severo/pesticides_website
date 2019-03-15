import {addShadowAroundGeometry} from './shadow';
import {placeLabelInPolygon} from './labels.js';

// TODO: add graticules to get an idea of lat/long and deformation?
// TODO: add a label for the Atlantic Ocean? We only have to generate the
// geojson polygon, inverting the countries and clipping at the extent
export const cfg = {
  statesPolygons: {
    fill: '#F8F8F8',
    stroke: '#BBB',
    strokeWidth: 1,
  },
};

export function createStates(
  parent,
  projection,
  path,
  width,
  height,
  data,
  svg,
  selectedGeometry,
  isWithShadow
) {
  createStatesPolygons(parent, path, data);
  if (isWithShadow) {
    addShadowAroundGeometry(parent, path, selectedGeometry);
  }
  createStatesLabels(parent, projection, width, height, data, svg);
}

function createStatesPolygons(parent, path, data) {
  const config = cfg.statesPolygons;
  return parent
    .append('g')
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('fill', config.fill)
    .attr('stroke', config.stroke)
    .attr('stroke-width', config.strokeWidth)
    .attr('d', path);
}

function createStatesLabels(parent, projection, width, height, data) {
  // TODO: short label, long label, colors
  const statesLabels = parent.append('g').classed('states-labels', true);
  data.features.forEach(feature =>
    placeLabelInPolygon(
      feature,
      projection,
      width,
      height,
      statesLabels,
      feature.properties.sigla,
      feature.properties.nome
    )
  );
  return statesLabels;
}
