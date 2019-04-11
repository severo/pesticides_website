import {createChoropleth} from './layers/choropleth';
import {createLegend} from './layers/legend';
//import {createSubstancesChoropleth} from './layers/substances/choropleth';
//import {createSubstancesTooltip} from './layers/substances/tooltip';
import {createOverlay} from './layers/overlay';
import {createTooltip} from './layers/tooltip';
import {geoPath} from 'd3-geo';

// The data is already projected, it's expressed in px, between 0 and 960px
const cfg = {
  data: {
    height: 960,
    width: 960,
  },
  drawing: {
    // 1 is low: the image is blurry. Set 1.5 or more
    scale: 1.5,
  },
  svg: {margin: 200},
};

export function makeMap(parent, dispatcher, data) {
  startLoading(parent);

  parent.html(null);

  // 1. create the map as a canvas - for efficiency

  // As the canvas is set to 100% width, a window resize will modify the client
  // size of the canvas.
  // The dimensions here are not related to that effective size (client size).
  // The canvas width and height attributes correspond to the size of the image
  // ie. 1.5x scale, and 0-960 in data -> 1440 px square image
  // (the image will later be redimensioned, ie. reduced, to enter in the 100%
  // of its container - ie 400px)
  const canvas = parent.append('canvas');
  canvas
    .attr('width', cfg.drawing.scale * cfg.data.width)
    .attr('height', cfg.drawing.scale * cfg.data.height);
  const context = canvas.node().getContext('2d');
  const scale = cfg.drawing.scale;
  context.scale(scale, scale);
  context.lineJoin = 'round';
  context.lineCap = 'round';

  // Path is a function that transforms a geometry (a point, a line, a
  // polygon) into a canvas path (also allows to generate SVG paths, for
  // example)
  // Note that it takes geographic coordinates as an input, not planar ones
  // But as the data is already expressed in px, in 960x960 viewport, no need
  // to pass it a projection as an argument
  const path = geoPath(null, context);
  createChoropleth(context, dispatcher, path, data, scale);

  // 2. add an SVG layer over the canvas, for interactivity

  const svg = parent
    .append('svg')
    .style('position', 'absolute')
    .style('top', '0px')
    .style('left', '0px')
    .attr('viewBox', '0,0,' + cfg.data.width + ',' + cfg.data.height);

  createLegend(svg, dispatcher);
  createTooltip(svg, dispatcher);
  createOverlay(svg, dispatcher, data, canvas, cfg.data.width);

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
