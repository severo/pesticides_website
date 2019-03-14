import {geoMercator, geoPath} from 'd3-geo';
import {geoPolyconic} from 'd3-geo-projection';

export function createProjection(width, height, cfg, geometry) {
  return getProjection[cfg.type]()
    .fitExtent(
      [
        [cfg.fitMargin, cfg.fitMargin],
        [width - cfg.fitMargin, height - cfg.fitMargin],
      ],
      geometry
    )
    .clipExtent([[0, 0], [width, height]]);
}

export function createPath(projection) {
  return geoPath().projection(projection);
}

const getProjection = {
  epsg5530: epsg5530,
  mercator: mercator,
};

// EPSG-5530 is the "official" projection for Brazil
// PROJ.4:
// '+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=aust_SA
//  +towgs84=-67.35,3.88,-38.22,0,0,0,0 +units=m +no_defs'
// See:
//  - https://observablehq.com/@fil/epsg-5530 for its use in D3.js
//  - https://epsg.io/?q=Brazil%20kind%3APROJCRS
function epsg5530() {
  const lon_0 = -54;
  return geoPolyconic().rotate([-lon_0, 0]);
}

function mercator() {
  return geoMercator();
}
