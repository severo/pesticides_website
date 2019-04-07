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
  parent
    .append('ul')
    .append('li')
    .classed('is-active', true)
    .classed('is-hidden', true)
    .append('a')
    .attr('href', '#')
    .attr('aria-current', 'page')
    .text('{{breadcrumb.brazil}}');
}

function makeMun(parent, dispatcher, data, mun) {
  parent.html(null);
  const ul = parent.append('ul');
  ul.append('li')
    .append('a')
    .attr('href', '#')
    .text('{{breadcrumb.brazil}}')
    .on('click', (ft, element) => {
      // invoke callbacks
      dispatcher.call('breadcrumb-click-brazil', null, data);
    });
  ul.append('li')
    .classed('is-active', true)
    .append('a')
    .attr('href', '#')
    .attr('aria-current', 'page')
    .text(mun.properties.name);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
