const cfg = {
  shadow: {fill: '#F8F8F8', stroke: '#BBB', strokeWidth: 1},
  svgFilter: {
    id: 'filter1',
    stdDeviation: 3,
    type: 'feDropShadow',
  },
};

export function addShadowFilter(parent) {
  const config = cfg.svgFilter;
  return parent
    .append('filter')
    .attr('id', config.id)
    .append(config.type)
    .attr('stdDeviation', config.stdDeviation);
}
export function addShadowAroundGeometry(parent, path, geometry) {
  const config = cfg.shadow;
  return parent
    .append('path')
    .attr('fill', config.fill)
    .attr('stroke', config.stroke)
    .attr('stroke-width', config.strokeWidth)
    .attr('d', path(geometry))
    .attr('filter', 'url(#' + cfg.svgFilter.id + ')');
}
