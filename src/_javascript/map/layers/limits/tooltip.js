import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';

const cfg = {
  nx: 200,
  ny: 700,
};

export function createLimitsTooltip(parent, path, dispatcher) {
  // create a container for tooltips
  const tooltip = parent.append('g').classed('tooltip', true);

  dispatcher.on('mun-mouseover-limits.Tooltip', data => {
    tooltip.call(createLimitsAnnotation(data));
  });
  dispatcher.on('mun-mouseout-limits.Tooltip', data => {
    tooltip.html('');
  });
}

// this function will call d3.annotation when a tooltip has to be drawn
function createLimitsAnnotation(data) {
  return annotation()
    .type(annotationCalloutElbow)
    .annotations([
      {
        data: data,
        note: {
          label: message(data.value),
          title: data.properties.name + ' (' + data.properties.fuName + ')',
        },
        nx: cfg.nx,
        ny: cfg.ny,
        x: data.properties.centroid[0], // eslint-disable-line id-length
        y: data.properties.centroid[1], // eslint-disable-line id-length
      },
    ]);
}

function message(value) {
  if (!Number.isInteger(value)) {
    return 'Never tested.';
  } else if (value === 0) {
    return 'No pesticide found above the legal limit.';
  }
  return value + ' pesticide(s) found above the legal limit.';
}
