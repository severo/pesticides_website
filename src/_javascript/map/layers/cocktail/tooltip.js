import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';

const cfg = {
  nx: 200,
  ny: 700,
};

export function createCocktailTooltip(parent, path, dispatcher) {
  // create a container for tooltips
  const tooltip = parent.append('g').classed('tooltip', true);

  dispatcher.on('mun-mouseover-cocktail.tooltip', data => {
    // TODO: factorize code - we copy/paste quickly for short term demo
    tooltip.call(createCocktailAnnotation(data));
  });
  dispatcher.on('mun-mouseout-cocktail.ooltip', data => {
    tooltip.html('');
  });
}

// this function will call d3.annotation when a tooltip has to be drawn
function createCocktailAnnotation(data) {
  return annotation()
    .type(annotationCalloutElbow)
    .annotations([
      {
        data: data,
        note: {
          label: Number.isInteger(data.value)
            ? data.value + ' pesticide(s) found in the drinking water.'
            : 'Never tested.',
          title: data.properties.name + ' (' + data.properties.fuName + ')',
        },
        nx: cfg.nx,
        ny: cfg.ny,
        x: data.properties.centroid[0], // eslint-disable-line id-length
        y: data.properties.centroid[1], // eslint-disable-line id-length
      },
    ]);
}
