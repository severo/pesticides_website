import {annotation, annotationCalloutCircle} from 'd3-svg-annotation';

const cfg = {
  nx: 220,
  ny: 700,
  radius: {min: 20, padding: 5},
};

const map2LabelByCategory = [
  '{{map.tooltip.limits.nevertested}}',
  '{{map.tooltip.limits.below}}',
  '{{map.tooltip.limits.aboveeu}}',
  '{{map.tooltip.limits.abovebr}}',
];
function cocktailLabel(mun) {
  return Number.isInteger(mun.properties.map1Number)
    ? mun.properties.map1Number + ' {{map.tooltip.cocktail.found}}.'
    : '{{map.tooltip.cocktail.nevertested}}.';
}
function limitsLabel(mun) {
  return map2LabelByCategory[mun.properties.map2Category];
}

export function createTooltip(parent, dispatcher, widths, initTransform) {
  // create a container for tooltips
  const tooltip = parent.append('g').classed('tooltip', true);

  function updateState(label, transform, curMun, rememberedMun) {
    // label
    dispatcher.on('make-app-cocktail.tooltip', state => {
      updateState(cocktailLabel, transform, curMun, rememberedMun);
    });
    dispatcher.on('make-app-limits.tooltip', state => {
      updateState(limitsLabel, transform, curMun, rememberedMun);
    });
    // transform
    dispatcher.on('zoomed.tooltip', state => {
      if (state.mun) {
        updateState(label, state.transform, state.mun, state.mun);
      } else {
        updateState(label, state.transform, curMun, rememberedMun);
      }
    });
    // current municipality
    dispatcher.on('mun-mouseover.tooltip', mun => {
      updateState(label, transform, mun, rememberedMun);
    });
    dispatcher.on('mun-mouseout.tooltip', () => {
      updateState(label, transform, rememberedMun, rememberedMun);
    });
    // current municipality and remembered municipality
    dispatcher.on('to-mun-view.tooltip', selectedMun => {
      updateState(label, transform, selectedMun, selectedMun);
    });

    if (curMun && label) {
      showTooltip(tooltip, label, curMun, widths, transform);
    } else {
      clearTooltip(tooltip);
    }
  }

  updateState(null, initTransform, null, null);
  /*
  function update(label, state, transform) {
    function rememberSelectedMun(selectedMun) {
      showTooltip(tooltip, label, selectedMun, widths, transform);

      // Show the remembered mun, if none is hovered
      dispatcher.on('mun-mouseout.tooltip', () => {
        showTooltip(tooltip, label, selectedMun, widths, transform);
      });
      // If zoom changes, update the internal state of tooltip
      dispatcher.on('zoomed.tooltip', updatedTransform => {
        update(label, {data: state.data, mun: selectedMun}, updatedTransform);
        dispatcher.on('make-app-cocktail.tooltip', newState => {
          update(cocktailLabel, newState, updatedTransform);
        });
        dispatcher.on('make-app-limits.tooltip', newState => {
          update(limitsLabel, newState, updatedTransform);
        });
      });
    }
    function forgetSelectedMun() {
      // Remove the tooltip if the overlay sends the event that no mun is
      // hovered
      dispatcher.on('mun-mouseout.tooltip', () => clearTooltip(tooltip));
      // If zoom changes, update the internal state of tooltip
      dispatcher.on('zoomed.tooltip', updatedTransform => {
        update(label, {data: state.data}, updatedTransform);
        dispatcher.on('make-app-cocktail.tooltip', newState => {
          update(cocktailLabel, newState, updatedTransform);
        });
        dispatcher.on('make-app-limits.tooltip', newState => {
          update(limitsLabel, newState, updatedTransform);
        });
      });
    }
    // Show the tooltip when the overlay sends the event that a mun has been
    // hovered
    dispatcher.on('mun-mouseover.tooltip', mun => {
      showTooltip(tooltip, label, mun, widths, transform);
      dispatcher.on('zoomed.tooltip-mouseover', updatedTransform => {
        showTooltip(tooltip, label, mun, widths, updatedTransform);
      });
    });
    // Remove the tooltip and forget about the selected mun when going to brazil
    // view
    dispatcher.on('to-brazil-view.tooltip', () => {
      forgetSelectedMun();
      clearTooltip(tooltip);
    });
    // When a mun is selected, by clic or search box, remember that selected mun
    // (in order to stick to it in stable state), and show the tooltip
    dispatcher.on('to-mun-view.tooltip mun-click.tooltip', selectedMun => {
      rememberSelectedMun(selectedMun);
    });

    if ('mun' in state) {
      rememberSelectedMun(state.mun);
    } else {
      forgetSelectedMun();
    }
  }
  dispatcher.on('make-app-cocktail.tooltip', state => {
    update(cocktailLabel, state, initTransform);
  });
  dispatcher.on('make-app-limits.tooltip', state => {
    update(limitsLabel, state, initTransform);
  });*/
}

function clearTooltip(tooltip) {
  tooltip.html('');
}
function showTooltip(tooltip, label, mun, widths, transform) {
  tooltip.call(createAnnotation(label, mun, widths, transform));
}

// this function will call d3.annotation when a tooltip has to be drawn
function createAnnotation(label, mun, widths, transform) {
  const dataPoint = mun.properties.centroid;
  const canvasPoint = dataPoint.map(dim => (dim * widths.canvas) / widths.data);
  const zoomedCanvasPoint = transform.apply(canvasPoint);
  const svgPoint = zoomedCanvasPoint.map(
    dim => (dim * widths.svg) / widths.canvas
  );
  /*const transformedCentroid = transform
    .apply(mun.properties.centroid.map(dim => dim * scale))
    .map(dim => dim / scale);*/
  // TODO: radius
  const transformedRadius = transform.k * mun.properties.radius;
  return annotation()
    .type(annotationCalloutCircle)
    .annotations([
      {
        data: mun,
        note: {
          bgPadding: 10,
          label: label(mun),
          title: mun.properties.name + ' (' + mun.properties.fuName + ')',
          wrap: cfg.nx,
        },
        nx: cfg.nx,
        ny: cfg.ny,
        subject: {
          radius: Math.max(transformedRadius, cfg.radius.min),
          radiusPadding: cfg.radius.padding,
        },
        x: svgPoint[0], // eslint-disable-line id-length
        y: svgPoint[1], // eslint-disable-line id-length
      },
    ]);
}
