import {interpolateYlGn, scaleLinear} from 'd3';

const cfg = {
  defaultFill: '#eee',
  max: 27,
};

export function createChoropleth(parent, path, data) {
  parent
    .append('g')
    .classed('choropleth', true)
    .selectAll('path')
    .data(data.mun.features)
    .enter()
    .append('path')
    .attr('id', ft => 'id-' + ft.properties.ibgeCode)
    .attr('d', path)
    .attr('fill', ft => {
      // For map 1 - cocktail
      if (!isNaN(ft.properties.map1Number)) {
        return cocktailColor(ft.properties.map1Number);
      }
      return cfg.defaultFill;
    })
    .attr('class', ft => {
      // for map 2 - limits
      return 'cat-' + ft.properties.map2Category;
    });
}

const cocktailColor = scaleLinear()
  .domain([0, cfg.max])
  .interpolate(() => interpolateYlGn);
