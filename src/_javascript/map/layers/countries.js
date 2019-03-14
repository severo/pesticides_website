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
export function createCountriesLabel(parent, path, data, cfg) {
  //const countriesLabels = parent.append('g').classed('countries-labels', true);
  //data.forEach(placeLabelInPolygon);
}

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
