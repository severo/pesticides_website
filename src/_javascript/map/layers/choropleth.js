import {interpolateYlOrRd, scaleLinear} from 'd3';

const cfg = {
  max: 27,
};

export function createChoropleth(parent, dispatcher, path, data) {
  const paths = parent
    .append('g')
    .classed('choropleth', true)
    .selectAll('path')
    .data(data.mun.features)
    .enter()
    .append('path')
    .attr('id', ft => 'id-' + ft.properties.ibgeCode)
    .attr('d', path);

  dispatcher.on('make-app-cocktail.choropleth', () => cocktailColors(paths));
  dispatcher.on('make-app-limits.choropleth', () => limitsColors(paths));
}

function cocktailColors(paths) {
  paths
    .style('fill', ft => {
      if (!isNaN(ft.properties.map1Number)) {
        return cocktailColor(ft.properties.map1Number);
      }
    })
    .attr('class', '');
}

function limitsColors(paths) {
  paths.style('fill', '').attr('class', ft => {
    return 'cat-' + ft.properties.map2Category;
  });
}
export const cocktailColor = scaleLinear()
  .domain([0, cfg.max])
  .interpolate(() => interpolateYlOrRd);
