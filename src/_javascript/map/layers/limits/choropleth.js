//import {axisBottom, interpolateYlOrRd, range, scaleLinear} from 'd3';
import {MAP2} from '../../../data';
import {schemeBlues} from 'd3';

const cfg = {
  field: 'supBr',
  legend: {
    height: 10,
    subtitleOffset: 8,
    tickSize: 15,
    titleOffset: 22,
    width: 270,
  },
  typename: {
    click: 'mun-click',
    mouseout: 'mun-mouseout',
    mouseover: 'mun-mouseover',
  },
};
const NO_TEST_COLOR = null;

export function createLimitsChoropleth(parent, path, data, dispatcher) {
  const colorPalette = [NO_TEST_COLOR].concat(
    schemeBlues[Object.keys(MAP2.CATEGORY).length - 1]
  );
  // map2Category field should be present in all the municipalities
  const color = ft => colorPalette[ft.properties.map2Category];

  parent
    .append('g')
    .classed('choropleth', true)
    .selectAll('path')
    .data(data.mun.features)
    .enter()
    .append('path')
    .attr('id', ft => 'id-' + ft.properties.ibgeCode)
    .attr('d', path)
    .style('fill', ft => color(ft))
    .on('mouseover', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg.typename.mouseover, null, {
        properties: ft.properties,
        value: ft.properties.map2Category,
      });
    })
    .on('mouseout', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg.typename.mouseout);
    })
    .on('click', (ft, element) => {
      // invoke callbacks
      dispatcher.call(cfg.typename.click, null, ft);
    });
  //makeLegend(parent, maxNumberSupBr, color);
}

/*
function makeLegend(parent, maxNumber, color) {
  // TODO: should be a scheme (27 colors), not a continuous scale
  const xx = scaleLinear()
    .domain(color.domain())
    .rangeRound([0, cfg.legend.width]);

  const legend = parent
    .append('g')
    //.style('font-size', '0.8rem')
    //.style('font-family', 'sans-serif')
    .attr('transform', 'translate(550,50)');

  legend
    .selectAll('rect')
    .data(range(0, maxNumber, 1))
    .enter()
    .append('rect')
    .attr('height', cfg.legend.height)
    .attr('x', el => xx(el))
    .attr('width', cfg.legend.width / maxNumber)
    .attr('fill', el => color(el));

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legend.titleOffset)
    .attr('font-weight', 'bold')
    .text('Number of pesticides detected above the legal limit');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legend.subtitleOffset)
    .text(
      '(white: no pesticide, purple: ' + maxNumber + ' different pesticides)'
    );

  // Scale
  legend
    .append('g')
    .call(axisBottom(xx).tickSize(cfg.legend.tickSize))
    .select('.domain')
    .remove();
}
*/
