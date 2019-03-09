export function createCountries(parent, path, data, cfg) {
  return parent
    .append('g')
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('fill', cfg.fill)
    .attr('stroke', cfg.stroke)
    .attr('stroke-width', cfg.strokeWidth)
    .attr('d', path);
}
