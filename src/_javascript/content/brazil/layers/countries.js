import {addShadowAroundGeometry} from './shadow';
import {placeLabelInPolygon} from './labels.js';

// TODO: add graticules to get an idea of lat/long and deformation?
// TODO: add a label for the Atlantic Ocean? We only have to generate the
// geojson polygon, inverting the countries and clipping at the extent
export const cfg = {
  countriesPolygons: {
    fill: '#DDD',
    stroke: '#BBB',
    strokeWidth: 1,
  },
  seaBackground: {
    fill: '#e3eef9',
    stroke: 'none',
  },
};

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
  createSeaBackground(parent, width, height);
  createCountriesPolygons(parent, path, data);
  if (isWithShadow) {
    addShadowAroundGeometry(parent, path, selectedGeometry);
  }
  createCountriesLabels(parent, projection, width, height, data, svg);
}

function createSeaBackground(parent, width, height) {
  const config = cfg.seaBackground;
  return parent
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', config.fill)
    .attr('stroke', config.stroke);
}

function createCountriesPolygons(parent, path, data) {
  const config = cfg.countriesPolygons;
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
