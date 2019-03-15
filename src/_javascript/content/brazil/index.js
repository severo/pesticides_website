import {appendDefs, appendSvg} from './svg';
import {createPath, createProjection} from './projection';
import {addShadowFilter} from './layers/shadow';
import {createChoropleth} from './layers/choropleth';
import {createCountries} from './layers/countries';
import {createMap} from './map';
import {createStates} from './layers/states';

const cfg = {
  defaultHeight: 500,
  defaultWidth: 500,
  projection: {
    fitMargin: 20,
    type: 'epsg5530',
  },
};
export function create(state, content) {
  // Clean existing contents
  // TODO: be more clever
  content.html(null);

  // Height and width are special parameters, they could be variable
  // in a future version
  // TODO: variable height and width, depending on the screen size and layout
  const height = cfg.defaultHeight;
  const width = cfg.defaultWidth;
  const mapHeight = height;
  const mapWidth = width;

  // Setup basic DOM elements
  // TODO: use args or configuration instead of hardcoded div#map
  const svg = appendSvg(content, width, height);
  const svgDefs = appendDefs(svg);
  addShadowFilter(svgDefs);
  const map = createMap(svg, mapWidth, mapHeight);

  // TODO: move to the configuration, or to the arguments
  // Selected level of simplification, among: original, simplifiedForBrazil,
  // simplifiedForState
  // TODO: depend on state.zoom
  //const level = 'original';
  const level = 'simplifiedForBrazil';

  // Selected geometry: Brazil
  // TODO: depend on state.zoom - note: this is the brazil/index.js, it's
  // supposed to be only for Brazil zoom level
  const selectedGeometry = state.data.geojson[level].brazil;

  // Projection is a function that maps geographic coordinates to planar
  // coordinates in the SVG viewport
  const projection = createProjection(
    mapWidth,
    mapHeight,
    cfg.projection,
    selectedGeometry
  );

  // Path is a function that transforms a geometry (a point, a line, a polygon)
  // into a SVG path (also allows to generate canvas paths, for example)
  // Note that it takes geographic coordinates as an input, not planar ones
  // (that's why the projection is passed as an argument to create it)
  const path = createPath(projection);

  // Add sub-elements
  createCountries(
    map,
    projection,
    path,
    mapWidth,
    mapHeight,
    state.data.geojson[level].countries,
    svg,
    selectedGeometry,
    state.zoom === 'brazil'
  );

  createStates(
    map,
    projection,
    path,
    mapWidth,
    mapHeight,
    state.data.geojson[level].states,
    svg,
    selectedGeometry,
    state.zoom !== 'brazil'
  );

  // Add values elements
  createChoropleth();

  // TODO: evaluate if the function should return a value or not
  return svg;
}
