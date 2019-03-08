import * as d3 from 'd3';
import {cfg} from './cfg.js';
import {loadData} from './data.js';

function addFiltersToSvg(svg) {
  const defs = svg.append('defs');

  // Filter for the shade
  const filter1 = defs.append('filter').attr('id', 'filter1');
  filter1.append('feDropShadow').attr('stdDeviation', '3');

  // Marker for the arrow in legend
  defs
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', '10')
    .attr('refY', '0')
    .attr('markerWidth', cfg.arrowMarkerSize)
    .attr('markerHeight', cfg.arrowMarkerSize)
    .attr('orient', 'auto')
    .attr('stroke', cfg.arrowStroke)
    .attr('fill', 'none')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('class', 'arrowHead');

  //svg.append('style').text(forkAwesomeStyle);

  return svg;
}

const init = loadData.then(data => {
  console.log(
    'The CSV file has been loaded, it contains ' + data.length + ' rows'
  );

  const svg = d3.select('svg#map');
  addFiltersToSvg(svg);
  return '';
});

export {init};