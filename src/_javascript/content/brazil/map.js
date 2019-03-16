export function createMap(parent) {
  //, width, height) {
  const map = parent
    .append('g')
    // TODO: pass the class name as a parameter?
    .classed('map', true);
  /*.attr('width', width)
    .attr('height', height);*/

  return map;
}
