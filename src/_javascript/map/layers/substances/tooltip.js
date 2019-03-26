import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';

const cfg = {
  nx: 200,
  ny: 700,
};

export function createSubstancesTooltip(parent, path, dispatcher, substance) {
  // create a container for tooltips
  const tooltip = parent.append('g').classed('tooltip', true);

  dispatcher.on('mun-mouseover.tooltip', data => {
    tooltip.call(createAnnotation(data, substance));
  });
  dispatcher.on('mun-mouseout.tooltip', data => {
    tooltip.html('');
  });
}

// this function will call d3.annotation when a tooltip has to be drawn
function createAnnotation(data, substance) {
  return annotation()
    .type(annotationCalloutElbow)
    .annotations([
      {
        data: data,
        note: {
          label: message(data.value, substance),
          title: data.properties.name + ' (' + data.properties.fuName + ')',
        },
        nx: cfg.nx,
        ny: cfg.ny,
        x: data.properties.centroid[0], // eslint-disable-line id-length
        y: data.properties.centroid[1], // eslint-disable-line id-length
      },
    ]);
}

const DETECTED_VALUE = 1e-10;

function message(value, substance) {
  if (value === null) {
    return 'Never tested.';
  } else if (value === 0) {
    return 'Never detected.';
  } else if (value === DETECTED_VALUE) {
    return 'Detected, but not quantized.';
  }
  return 'Max concentration: ' + value.toLocaleString('pt-BR') + ' μg/L';
}
