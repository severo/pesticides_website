import {createCocktailChoropleth} from './layers/cocktail/choropleth';
import {createCocktailTooltip} from './layers/cocktail/tooltip';
import {createFuFrontiers} from './layers/fu';
import {createLimitsChoropleth} from './layers/limits/choropleth';
import {createLimitsTooltip} from './layers/limits/tooltip';
//import {createSubstancesChoropleth} from './layers/substances/choropleth';
//import {createSubstancesTooltip} from './layers/substances/tooltip';
import {geoPath} from 'd3-geo';

// The data is already projected, it's expressed in px, between 0 and 960px
const cfg = {
  viewport: {
    height: 960,
    width: 960,
  },
};

export function makeMap(parent, dispatcher, view, data) {
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

  if (view === 'limits') {
    createLimits(svg, path, data, dispatcher);
  } else if (view === 'substances') {
    createSubstances(svg, path, data, dispatcher);
  } else {
    createCocktail(svg, path, data, dispatcher);
  }

  endLoading(parent);
}

function createCocktail(svg, path, data, dispatcher) {
  svg.html(null);
  createCocktailChoropleth(svg, path, data, dispatcher);
  createFuFrontiers(svg, path, data);
  createCocktailTooltip(svg, path, dispatcher);
}

function createLimits(svg, path, data, dispatcher) {
  svg.html(null);
  createLimitsChoropleth(svg, path, data, dispatcher);
  createFuFrontiers(svg, path, data);
  createLimitsTooltip(svg, path, dispatcher);
}

function createSubstances(svg, path, data, dispatcher) {
  svg.html(null);
  //createSubstancesChoropleth(svg, path, data, dispatcher);
  createFuFrontiers(svg, path, data);
  //createSubstancesTooltip(svg, path, dispatcher);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
