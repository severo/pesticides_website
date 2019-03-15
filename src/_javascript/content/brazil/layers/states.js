import {addShadowAroundGeometry} from './shadow';
import {placeLabelInPolygon} from './labels.js';

// TODO: add graticules to get an idea of lat/long and deformation?

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
  // TODO: remove labels for the states? Put them above the choropleth?
  createStatesLabels(parent, projection, width, height, data, svg);
}

function createStatesPolygons(parent, path, data) {
  return parent
    .append('g')
    .classed('states-polygons', true)
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
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
