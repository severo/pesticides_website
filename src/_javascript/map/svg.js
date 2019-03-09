import {select} from 'd3-selection';

export function createSvg(width, height) {
  // TODO: pass hardcoded div#map from the arguments or the configuration
  return select('div#map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0,0,' + width + ',' + height);
}

export function addDefsToSvg(svg) {
  return svg.append('defs');
}
