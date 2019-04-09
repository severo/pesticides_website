export function createOverlay(parent, path, dispatcher, data) {
  function rememberSelectedMun(selectedMun) {
    parent
      .selectAll('.overlay path')
      .classed(
        'selected',
        mun => mun.properties.ibgeCode === selectedMun.properties.ibgeCode
      );
  }
  function forgetSelectedMun() {
    parent.selectAll('.overlay path').classed('selected', false);
  }
  dispatcher.on('to-brazil-view.overlay', forgetSelectedMun);
  dispatcher.on('to-mun-view.overlay mun-click.overlay', rememberSelectedMun);

  function updateView(state) {
    // Select the municipality, if needed
    if ('mun' in state) {
      rememberSelectedMun(state.mun);
    } else {
      forgetSelectedMun();
    }
  }

  parent
    .append('g')
    .classed('overlay', true)
    .selectAll('path')
    .data(data.mun.features)
    .enter()
    .append('path')
    // id is currently useless
    .attr('id', ft => 'overlay-id-' + ft.properties.ibgeCode)
    .attr('d', path)
    .on('mouseover', (ft, element) => {
      // invoke callbacks
      dispatcher.call('mun-mouseover', null, ft);
    })
    .on('mouseout', (ft, element) => {
      // invoke callbacks
      dispatcher.call('mun-mouseout');
    })
    .on('click', (ft, element) => {
      // invoke callbacks
      dispatcher.call('mun-click', null, ft);
    });

  dispatcher.on(
    'make-app-cocktail.tooltip make-app-limits.tooltip',
    updateView
  );
}
