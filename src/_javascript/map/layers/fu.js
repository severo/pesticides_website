export function createFuPolygons(parent, path, data) {
  return parent
    .append('g')
    .classed('fu-polygons', true)
    .selectAll('path')
    .data(data.fu.features)
    .enter()
    .append('path')
    .attr('d', path);
}

export function createFuFrontiers(parent, path, data) {
  return parent
    .append('g')
    .classed('fu-frontiers', true)
    .selectAll('path')
    .data(data.internalFu.features)
    .enter()
    .append('path')
    .attr('d', path);
}
