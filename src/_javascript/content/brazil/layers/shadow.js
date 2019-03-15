const cfg = {
  id: 'filter1',
  stdDeviation: 3,
  type: 'feDropShadow',
};

export function addShadowFilter(parent) {
  return parent
    .append('filter')
    .attr('id', cfg.id)
    .append(cfg.type)
    .attr('stdDeviation', cfg.stdDeviation);
}
export function addShadowAroundGeometry(parent, path, geometry) {
  return parent
    .append('g')
    .classed('shadow', true)
    .append('path')
    .attr('d', path(geometry))
    .attr('filter', 'url(#' + cfg.id + ')');
}
