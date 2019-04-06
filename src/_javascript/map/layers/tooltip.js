import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';

const cfg = {
  nx: 220,
  ny: 700,
};

const map2LabelByCategory = [
  'Never tested',
  'All substances below the Brazilian and European limits',
  'Subtance(s) detected above the European limit',
  'Subtance(s) detected above the Brazilian limit',
];
function cocktailLabel(mun) {
  return Number.isInteger(mun.properties.map1Number)
    ? mun.properties.map1Number + ' pesticide(s) found in the drinking water.'
    : 'Never tested.';
}
function limitsLabel(mun) {
  return map2LabelByCategory[mun.properties.map2Category];
}

export function createTooltip(parent, dispatcher) {
  // create a container for tooltips
  const tooltip = parent.append('g').classed('tooltip', true);

  function updateView(label, state) {
    function rememberSelectedMun(selectedMun) {
      dispatcher.on('mun-mouseout.tooltip', () =>
        showTooltip(tooltip, label, selectedMun)
      );
    }
    function forgetSelectedMun() {
      dispatcher.on('mun-mouseout.tooltip', () => clearTooltip(tooltip));
    }

    if ('mun' in state) {
      rememberSelectedMun(state.mun);
    } else {
      forgetSelectedMun();
    }

    dispatcher.on('mun-mouseover.tooltip', mun =>
      showTooltip(tooltip, label, mun)
    );
    dispatcher.on('to-brazil-view.tooltip ', () => {
      forgetSelectedMun();
      clearTooltip(tooltip);
    });
    dispatcher.on('to-mun-view.tooltip mun-click.tooltip', selectedMun => {
      rememberSelectedMun(selectedMun);
      showTooltip(tooltip, label, selectedMun);
    });
  }

  dispatcher.on('make-app-cocktail.tooltip', state => {
    updateView(cocktailLabel, state);
  });
  dispatcher.on('make-app-limits.tooltip', state => {
    updateView(limitsLabel, state);
  });
}

function clearTooltip(tooltip) {
  tooltip.html('');
}
function showTooltip(tooltip, label, mun) {
  tooltip.call(createAnnotation(label, mun));
}

// this function will call d3.annotation when a tooltip has to be drawn
function createAnnotation(label, mun) {
  return annotation()
    .type(annotationCalloutElbow)
    .annotations([
      {
        data: mun,
        note: {
          label: label(mun),
          title: mun.properties.name + ' (' + mun.properties.fuName + ')',
          wrap: cfg.nx,
        },
        nx: cfg.nx,
        ny: cfg.ny,
        x: mun.properties.centroid[0], // eslint-disable-line id-length
        y: mun.properties.centroid[1], // eslint-disable-line id-length
      },
    ]);
}
