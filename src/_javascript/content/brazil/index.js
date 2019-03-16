import {appendSvg} from './svg';
//import {appendDefs, appendSvg} from './svg';
//import {addShadowFilter} from './layers/shadow';
import {createChoropleth} from './layers/choropleth';
import {createFuFrontiers} from './layers/fu';
import {createMap} from './map';
import {createPath} from './projection';

const cfg = {
  defaultHeight: 500,
  defaultWidth: 500,
};
/*projection: {
    fitMargin: 20,
    type: 'epsg5530',
  },*/

export function create(view) {
  return (state, content, dispatcher) => {
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
    //const svgDefs = appendDefs(svg);
    //addShadowFilter(svgDefs);
    const map = createMap(svg, mapWidth, mapHeight);

    // TODO: move to the configuration, or to the arguments
    // Selected level of simplification, among: original, simplifiedForBrazil,
    // simplifiedForState
    // TODO: depend on state.zoom
    //const level = 'original';
    //const level = 'simplifiedForBrazil';

    // Selected geometry: Brazil
    // TODO: depend on state.zoom - note: this is the brazil/index.js, it's
    // supposed to be only for Brazil zoom level
    //const selectedGeometry = state.data.geojson[level].states;

    // Projection is a function that maps geographic coordinates to planar
    // coordinates in the SVG viewport
    // The data is already projected - it's in px, between 0 and 960 px, both
    // in x and y.
    /*const projection = createProjection(
      mapWidth,
      mapHeight,
      cfg.projection,
      selectedGeometry
    );*/

    // Path is a function that transforms a geometry (a point, a line, a polygon)
    // into a SVG path (also allows to generate canvas paths, for example)
    // Note that it takes geographic coordinates as an input, not planar ones
    // (that's why the projection is passed as an argument to create it)
    //const path = createPath(projection);
    // As the data is already expressed in px, in 960x960 viewport, no need to
    // pass a projection
    const path = createPath();

    // Add sub-elements
    /*createCountries(
      map,
      path,
      mapWidth,
      mapHeight,
      state.data.geojson[level].countries,
      svg,
      selectedGeometry,
      state.zoom === 'brazil'
    );*/

    // Add values elements
    createChoropleth(map, state.data, path, view, dispatcher);

    createFuFrontiers(map, path, state.data);

    // TODO: evaluate if the function should return a value or not
    return svg;
  };
}
