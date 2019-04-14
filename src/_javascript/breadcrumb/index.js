export function makeBreadcrumb(parent, dispatcher, state) {
  startLoading(parent);

  // Init
  if ('mun' in state) {
    makeMun(parent, dispatcher, state.data, state.mun);
  } else {
    makeBrazil(parent);
  }

  dispatcher.on('to-mun-view.breadcrumb', mun => {
    makeMun(parent, dispatcher, state.data, mun);
  });

  dispatcher.on('to-brazil-view.breadcrumb', () => {
    makeBrazil(parent);
  });

  endLoading(parent);
}

function makeBrazil(parent) {
  parent.html(null);
}

function makeMun(parent, dispatcher, data, mun) {
  parent.html(null);
  parent
    .append('a')
    .attr('href', '#')
    .text('{{breadcrumb.goto-brazil}}')
    .on('click', (ft, element) => {
      dispatcher.call('breadcrumb-click-brazil', null, data);
    });
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
