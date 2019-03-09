import {geoMercator} from 'd3-geo';

export function createProjection(width, height, fitMargin, geometry) {
  return geoMercator()
    .fitExtent(
      [[fitMargin, fitMargin], [width - fitMargin, height - fitMargin]],
      geometry
    )
    .clipExtent([[0, 0], [width, height]]);
}
