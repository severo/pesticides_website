import {cfg} from './cfg';
import {createProjection} from './projection';

export function createMap(data) {
  const projection = createProjection(
    cfg.width,
    cfg.height,
    cfg.fitMargin,
    data.geojson.brazil
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
