// The data is already projected, it's expressed in px, between 0 and 960px
const cfg = {
  viewport: {
    height: 960,
    width: 960,
  },
};

export function appendSvg(parent) {
  return (
    parent
      .append('svg')
      /*.attr('width', width)
    .attr('height', height)*/
      .attr('viewBox', '0,0,' + cfg.viewport.width + ',' + cfg.viewport.height)
  );
}

export function appendDefs(parent) {
  return parent.append('defs');
}
