export function makeBreadcrumb(parent, dispatcher, data) {
  startLoading(parent);

  dispatcher.on('to-mun-view.breadcrumb', mun => {
    const ul = parent.select('ul');
    ul.html(null);
    ul.append('li')
      .append('a')
      .attr('href', '#')
      .text('Brazil')
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
  });

  dispatcher.on('to-brazil-view.breadcrumb', mun => {
    const ul = parent.select('ul');
    ul.html(null);
    ul.append('li')
      .classed('is-active', true)
      .append('a')
      .attr('href', '#')
      .attr('aria-current', 'page')
      .text('Brazil');
  });

  endLoading(parent);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
