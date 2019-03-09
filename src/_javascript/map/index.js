import {addDefsToSvg, createSvg} from './svg';
import {addShadowAroundGeometry, addShadowFilter} from './shadow';
import {createPath, createProjection} from './projection';
import {cfg} from './cfg';
import {createCountries} from './countries';
import {createMap} from './map';
import {createSeaBackground} from './seaBackground';

export function createBigMap(data) {
  // Height and width are special parameters, they could be variable
  // in a future version
  // TODO: variable height and width, depending on the screen size and layout
  const height = cfg.defaultHeight;
  const width = cfg.defaultWidth;
  const mapHeight = height;
  const mapWidth = width;

  // Setup basic DOM elements
  const svg = createSvg(width, height);
  const svgDefs = addDefsToSvg(svg);
  addShadowFilter(svgDefs, cfg.shadow.svgFilter);
  const map = createMap(svg, mapWidth, mapHeight);

  // Selected geometry: Brazil
  const selectedGeometry = data.geojson.brazil;

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
  // Note that it takes geographic coordinates, not planar ones
  // (that's why the projection is passed as an argument)
  const path = createPath(projection);

  // Add sub-elements
  // TODO: simplify geometries?
  createSeaBackground(map, mapWidth, mapHeight, cfg.seaBackground);
  createCountries(map, path, data.geojson.countries, cfg.countries);
  addShadowAroundGeometry(map, path, selectedGeometry, cfg.shadow);

  // TODO: evaluate if the function should return a value or not
  return svg;
}
