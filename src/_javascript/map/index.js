import {
  createCocktailChoropleth,
  createCocktailOverlay,
} from './layers/cocktail/choropleth';
import {
  createLimitsChoropleth,
  createLimitsOverlay,
} from './layers/limits/choropleth';
import {createCocktailTooltip} from './layers/cocktail/tooltip';
import {createFuFrontiers} from './layers/fu';
import {createLimitsTooltip} from './layers/limits/tooltip';
import {createSubstancesChoropleth} from './layers/substances/choropleth';
import {createSubstancesTooltip} from './layers/substances/tooltip';
import {geoPath} from 'd3-geo';

// The data is already projected, it's expressed in px, between 0 and 960px
const cfg = {
  viewport: {
    height: 960,
    width: 960,
  },
};

export function makeMap(parent, dispatcher, view, state) {
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

  if ('mun' in state) {
    makeMun(svg, path, dispatcher, view, state.data, state.mun);
  } else {
    makeBrazil(svg, path, dispatcher, view, state.data);
  }

  dispatcher.on('to-brazil-view.map', () => {
    updateOverlay(svg, null);
  });
  dispatcher.on('to-mun-view.map mun-click.map', mun => {
    updateOverlay(svg, mun);
  });

  endLoading(parent);
}

function updateOverlay(parent, mun) {
  // Remove any previous selected mun
  parent.selectAll('.overlay path').classed('selected', false);
  // Highlight this new mun
  if (mun !== null) {
    parent
      .select('.overlay path#overlay-id-' + mun.properties.ibgeCode)
      .classed('selected', true);
  }
}

function makeBrazil(svg, path, dispatcher, view, data) {
  if (view === 'limits') {
    createLimits(svg, path, data, dispatcher);
  } else if (view === 'substances') {
    // init
    const defaultSubstance = data.substancesLut['25'];
    createSubstances(svg, path, data, dispatcher, defaultSubstance);

    dispatcher.on('substance-selected', substance =>
      createSubstances(svg, path, data, dispatcher, substance)
    );
  } else {
    createCocktail(svg, path, data, dispatcher);
  }
}

function makeMun(svg, path, dispatcher, view, data, mun) {
  // TODO: show the selected municipality on the map (extra layer?)
  // TODO: avoid recreating the map on every click
  makeBrazil(svg, path, dispatcher, view, data);
  updateOverlay(svg, mun);
}

function createCocktail(svg, path, data, dispatcher) {
  svg.html(null);
  createCocktailChoropleth(svg, path, data, dispatcher);
  createFuFrontiers(svg, path, data);
  createCocktailOverlay(svg, path, data, dispatcher);
  createCocktailTooltip(svg, path, dispatcher);
}

function createLimits(svg, path, data, dispatcher) {
  svg.html(null);
  createLimitsChoropleth(svg, path, data, dispatcher);
  createFuFrontiers(svg, path, data);
  createLimitsOverlay(svg, path, data, dispatcher);
  createLimitsTooltip(svg, path, dispatcher);
}

function createSubstances(svg, path, data, dispatcher, substance) {
  svg.html(null);
  createSubstancesChoropleth(svg, path, data, dispatcher, substance);
  createFuFrontiers(svg, path, data);
  createSubstancesTooltip(svg, path, dispatcher, substance);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
