export function addShadowFilter(parent, cfg) {
  return parent
    .append('filter')
    .attr('id', cfg.id)
    .append(cfg.type)
    .attr('stdDeviation', cfg.stdDeviation);
}
export function addShadowAroundGeometry(parent, path, geometry, cfg) {
  return parent
    .append('path')
    .attr('fill', cfg.fill)
    .attr('stroke', cfg.stroke)
    .attr('stroke-width', cfg.strokeWidth)
    .attr('d', path(geometry))
    .attr('filter', 'url(#' + cfg.svgFilter.id + ')');
}
