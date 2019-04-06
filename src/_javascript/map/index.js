import {createChoropleth} from './layers/choropleth';
import {createFuFrontiers} from './layers/fu';
import {createOverlay} from './layers/overlay';
//import {createSubstancesChoropleth} from './layers/substances/choropleth';
//import {createSubstancesTooltip} from './layers/substances/tooltip';
import {createTooltip} from './layers/tooltip';
import {geoPath} from 'd3-geo';

// The data is already projected, it's expressed in px, between 0 and 960px
const cfg = {
  viewport: {
    height: 960,
    width: 960,
  },
};

export function makeMap(parent, dispatcher, data) {
  startLoading(parent);

  // Clean existing contents
  // TODO: be more clever?
  parent.html(null);

  const svg = parent
    .append('svg')
    .attr('viewBox', '0,0,' + cfg.viewport.width + ',' + cfg.viewport.height);

  // Path is a function that transforms a geometry (a point, a line, a
  // polygon) into a SVG path (also allows to generate canvas paths, for
  // example)
  // Note that it takes geographic coordinates as an input, not planar ones
  // But as the data is already expressed in px, in 960x960 viewport, no need
  // to pass it a projection as an argument
  const path = geoPath();

  createChoropleth(svg, path, data);
  createFuFrontiers(svg, path, data);
  createOverlay(svg, path, dispatcher, data);
  createTooltip(svg, dispatcher);

  endLoading(parent);
}

/*
function createSubstances(svg, path, data, dispatcher, substance) {
  //const defaultSubstance = data.substancesLut['25'];
  svg.html(null);
  createSubstancesChoropleth(svg, path, data, dispatcher, substance);
  createFuFrontiers(svg, path, data);
  createSubstancesTooltip(svg, path, dispatcher, substance, mun);
}
*/

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
