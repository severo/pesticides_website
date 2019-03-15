import {addShadowAroundGeometry} from './shadow';
import {placeLabelInPolygon} from './labels.js';

// TODO: add graticules to get an idea of lat/long and deformation?

export function createCountries(
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
  createBackground(parent, width, height);
  createCountriesPolygons(parent, path, data);
  if (isWithShadow) {
    addShadowAroundGeometry(parent, path, selectedGeometry);
  }
  createCountriesLabels(parent, projection, width, height, data, svg);
}

function createBackground(parent, width, height) {
  return parent
    .append('rect')
    .classed('background', true)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);
}

function createCountriesPolygons(parent, path, data) {
  return parent
    .append('g')
    .classed('countries-polygons', true)
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('d', path);
}

function createCountriesLabels(parent, projection, width, height, data) {
  const countriesLabels = parent.append('g').classed('countries-labels', true);
  // TODO: i18n (there is also a NAME_PT property) - or prepare it before hand
  data.features.forEach(feature =>
    placeLabelInPolygon(
      feature,
      projection,
      width,
      height,
      countriesLabels,
      feature.properties.ISO_A2,
      feature.properties.NAME
    )
  );
  return countriesLabels;
}
