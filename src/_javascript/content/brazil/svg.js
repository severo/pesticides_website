//const cfg = {defaultWidth: '40%'};

export function appendSvg(parent, width, height) {
  return parent
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0,0,' + width + ',' + height);
}

export function appendDefs(parent) {
  return parent.append('defs');
}
