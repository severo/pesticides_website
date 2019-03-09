import {geoMercator, geoPath} from 'd3-geo';

export function createProjection(width, height, cfg, geometry) {
  return geoMercator()
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
