export function createSeaBackground(parent, width, height, cfg) {
  return parent
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', cfg.fill)
    .attr('stroke', cfg.stroke);
}
