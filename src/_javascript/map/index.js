import {createProjection} from './projection';

export function createMap(cfg, data) {
  const projection = createProjection(
    cfg.width,
    cfg.height,
    cfg.fitMargin,
    data.geometry
  );

  /*  const path = d3.geoPath().projection(projection);

  const map = svg
    .append('g')
    .classed('map', true)
    .attr('width', width)
    .attr('height', height);
    */
  console.log('Map created.');
  return projection;
}
