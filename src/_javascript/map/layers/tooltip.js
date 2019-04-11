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
    .type(annotationCalloutCircle)
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
        subject: {
          radius: Math.max(mun.properties.radius, cfg.radius.min),
          radiusPadding: cfg.radius.padding,
        },
        x: mun.properties.centroid[0], // eslint-disable-line id-length
        y: mun.properties.centroid[1], // eslint-disable-line id-length
      },
    ]);
}
