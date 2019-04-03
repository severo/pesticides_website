import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';

const messageByCategory = [
  'Never tested',
  'All substances below the legal and European limits',
  'Subtance(s) detected above the European limit',
  'Subtance(s) detected exactly at the legal limit',
  'Subtance(s) detected above the legal limit',
];

const cfg = {
  nx: 220,
  ny: 700,
};

export function createLimitsTooltip(parent, path, dispatcher) {
  // create a container for tooltips
  const tooltip = parent.append('g').classed('tooltip', true);

  dispatcher.on('mun-mouseover.tooltip', data => {
    tooltip.call(createAnnotation(data));
  });
  dispatcher.on('mun-mouseout.tooltip', data => {
    tooltip.html('');
  });
}

// this function will call d3.annotation when a tooltip has to be drawn
function createAnnotation(data) {
  return annotation()
    .type(annotationCalloutElbow)
    .annotations([
      {
        data: data,
        note: {
          label: messageByCategory[data.value],
          title: data.properties.name + ' (' + data.properties.fuName + ')',
          wrap: cfg.nx,
        },
        nx: cfg.nx,
        ny: cfg.ny,
        x: data.properties.centroid[0], // eslint-disable-line id-length
        y: data.properties.centroid[1], // eslint-disable-line id-length
      },
    ]);
}
