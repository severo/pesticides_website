//import {interpolateYlOrRd, scaleLinear} from 'd3';
import {geoIdentity, geoPath} from 'd3-geo';

const cfg = {
  backgroundColor: '#f0f0f0',
  frontiers: {
    br: 1,
    fu: 0.5,
    mun: 0.25,
  },
  max: 27,
};

export function createChoropleth(
  context,
  dispatcher,
  data,
  widths,
  initTransform
) {
  // Path is a function that transforms a geometry (a point, a line, a
  // polygon) into a canvas path (also allows to generate SVG paths, for
  // example)
  // Note that it takes geographic coordinates as an input, not planar ones
  // But as the data is already expressed in px, in 960x960 viewport, no need
  // to pass it a projection as an argument
  const c_projection = geoIdentity().scale(widths.canvas / widths.data);
  const path = geoPath(c_projection, context);

  function drawCocktail(transform) {
    drawZoomedMap(
      context,
      path,
      data,
      widths,
      mun => cocktailColor(mun.properties.map1Category),
      transform
    );
  }
  function drawLimits(transform) {
    drawZoomedMap(
      context,
      path,
      data,
      widths,
      mun => limitsColor(mun.properties.map2Category),
      transform
    );
  }
  function appEvents(transform) {
    dispatcher.on('make-app-cocktail.choropleth', () => {
      drawCocktail(transform);
      dispatcher.on('zoomed.cocktail-choropleth', state => {
        drawCocktail(state.transform);
        appEvents(state.transform);
      });
    });
    dispatcher.on('make-app-limits.choropleth', () => {
      drawLimits(transform);
      dispatcher.on('zoomed.limits-choropleth', state => {
        drawLimits(state.transform);
        appEvents(state.transform);
      });
    });
  }
  appEvents(initTransform);
}

function drawZoomedMap(context, path, data, widths, color, transform) {
  context.save();
  context.clearRect(0, 0, widths.canvas, widths.canvas);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);
  drawMap(context, path, data, transform.k, color);
  context.restore();
}

function drawMap(context, path, data, scale, color) {
  data.mun.features.forEach(mun => {
    context.beginPath();
    path(mun);
    context.fillStyle = color(mun);
    context.fill();
  });

  // TODO: frontiers instead of polygons for municipalities
  context.beginPath();
  path(data.mun);
  context.lineWidth = cfg.frontiers.mun / scale;
  context.strokeStyle = '#aaa';
  context.stroke();

  context.beginPath();
  path(data.internalFu);
  context.lineWidth = cfg.frontiers.fu; /// scale;
  context.strokeStyle = '#000';
  context.stroke();

  context.beginPath();
  path(data.brazil);
  context.lineWidth = cfg.frontiers.br; /// scale;
  context.strokeStyle = '#000';
  context.stroke();
}

export const cocktailColor = function(value) {
  /*if (isNaN(value)) {
    return cfg.backgroundColor;
  }
  return scaleLinear()
    .domain([0, cfg.max])
    .interpolate(() => interpolateYlOrRd)(value);*/
  const colors = ['#f0f0f0', '#ffffcc', '#feb24c', '#e31a1c', '#800026'];
  //["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]
  return colors[value];
};
export const limitsColor = function(value) {
  const colors = ['#f4f4f4', '#74a3eb', '#001d93', '#01000f'];
  return colors[value];
};
