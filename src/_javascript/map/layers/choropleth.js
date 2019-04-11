import {interpolateYlOrRd, scaleLinear} from 'd3';

const cfg = {
  backgroundColor: '#f0f0f0',
  frontiers: {
    br: 1,
    fu: 0.5,
    mun: 0.25,
  },
  max: 27,
};

export function createChoropleth(context, dispatcher, path, data, scale) {
  dispatcher.on('make-app-cocktail.choropleth', () =>
    drawMap(context, path, data, scale, mun =>
      cocktailColor(mun.properties.map1Number)
    )
  );
  dispatcher.on('make-app-limits.choropleth', () =>
    drawMap(context, path, data, scale, mun =>
      limitsColor(mun.properties.map2Category)
    )
  );
}

function addFrontiers(context, path, data, scale) {
  // TODO: frontiers instead of polygons for municipalities
  context.beginPath();
  path(data.mun);
  context.lineWidth = cfg.frontiers.mun / scale;
  context.strokeStyle = '#aaa';
  context.stroke();

  context.beginPath();
  path(data.internalFu);
  context.lineWidth = cfg.frontiers.fu / scale;
  context.strokeStyle = '#000';
  context.stroke();

  context.beginPath();
  path(data.brazil);
  context.lineWidth = cfg.frontiers.br / scale;
  context.strokeStyle = '#000';
  context.stroke();
}

function drawMap(context, path, data, scale, color) {
  data.mun.features.forEach(mun => {
    context.beginPath();
    path(mun);
    context.fillStyle = color(mun);
    context.fill();
  });
  addFrontiers(context, path, data, scale);
}

export const cocktailColor = function(value) {
  if (isNaN(value)) {
    return cfg.backgroundColor;
  }
  return scaleLinear()
    .domain([0, cfg.max])
    .interpolate(() => interpolateYlOrRd)(value);
};
export const limitsColor = function(value) {
  const colors = ['#f4f4f4', '#74a3eb', '#001d93', '#01000f'];
  return colors[value];
};
