import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';

const cfg = {
  center: [480, 480], // eslint-disable-line no-magic-numbers
  //dx: 80,
  //dy: 30,
  nx: 200,
  ny: 700,
};

export function createTooltip(parent, path, dispatcher) {
  // create a container for tooltips
  const tooltip = parent.append('g').classed('tooltip', true);

  dispatcher.on('choropleth-mouseover.tooltip', data => {
    tooltip.call(createAnnotation(data));
  });
  dispatcher.on('choropleth-mouseout.tooltip', data => {
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
        //dx: data.properties.centroid[0] > cfg.center[0] ? -cfg.dx : cfg.dx,
        //dy: data.properties.centroid[1] > cfg.center[1] ? -cfg.dy : cfg.dy,
        note: {
          label: Number.isInteger(data.value)
            ? data.value + ' pesticide(s) found in the drinking water.'
            : 'Never tested.',
          title: data.properties.name + ' (' + data.properties.fu + ')',
        },
        nx: cfg.nx,
        ny: cfg.ny,
        subject: {
          //radius: data.properties.radius,
          //radiusPadding: 2,
          //height: data.properties.height,
          //width: data.properties.width,
        },
        x: data.properties.centroid[0], // eslint-disable-line id-length
        y: data.properties.centroid[1], // eslint-disable-line id-length
      },
    ]);
}
