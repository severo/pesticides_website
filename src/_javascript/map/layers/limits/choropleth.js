//import {axisBottom, interpolateYlOrRd, range, scaleLinear} from 'd3';
import {MAP2} from '../../../data';
import {scaleLinear} from 'd3';

const cfg = {
  legend: {
    height: 20,
    label: {xOffset: 30, yOffset: 15},
    subtitleOffset: 8,
    titleOffset: 22,
    width: 20,
  },
  typename: {
    click: 'mun-click',
    mouseout: 'mun-mouseout',
    mouseover: 'mun-mouseover',
  },
};

const legendKeys = ['SUP_BR', 'SUP_EU', 'BELOW', 'NO_TEST'];

const legendLabels = {
  BELOW: 'all agrotoxics below limits',
  NO_TEST: 'no data',
  SUP_BR: 'at least one above Brazilian limit',
  SUP_EU: 'at least one above European limit',
};

export function createLimitsChoropleth(parent, path, data, dispatcher) {
  parent
    .append('g')
    .classed('choropleth', true)
    .selectAll('path')
    .data(data.mun.features)
    .enter()
    .append('path')
    .attr('id', ft => 'id-' + ft.properties.ibgeCode)
    .attr('class', ft => 'cat-' + ft.properties.map2Category)
    .attr('d', path)
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
  makeLegend(parent);
}

function makeLegend(parent) {
  const yy = scaleLinear()
    .domain([0, legendKeys.length])
    .rangeRound([0, cfg.legend.height * legendKeys.length]);

  const legend = parent
    .append('g')
    .classed('legend', true)
    //.style('font-size', '0.8rem')
    //.style('font-family', 'sans-serif')
    .attr('transform', 'translate(550,50) scale(1.3)');

  legend
    .selectAll('rect')
    .data(legendKeys)
    .enter()
    .append('rect')
    .attr('class', key => 'cat-' + MAP2.CATEGORY[key])
    .attr('height', cfg.legend.height)
    .attr('y', (key, idx) => yy(idx))
    .attr('width', cfg.legend.width);

  legend
    .selectAll('text')
    .data(legendKeys)
    .enter()
    .append('text')
    .attr('x', cfg.legend.label.xOffset)
    .attr('y', (key, idx) => yy(idx) + cfg.legend.label.yOffset)
    .text(key => legendLabels[key]);

  const label = legend
    .append('g')
    .attr('fill', '#000')
    .attr('text-anchor', 'start');

  // TODO: i18n
  label
    .append('text')
    .attr('y', -cfg.legend.titleOffset)
    .attr('font-weight', 'bold')
    .text('Pesticides detected above legal limits');
  label
    .append('text')
    .attr('y', -cfg.legend.subtitleOffset)
    .attr('font-weight', 'bold')
    .text('in drinking water');
}
