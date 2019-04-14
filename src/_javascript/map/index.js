import {event, zoom, zoomIdentity} from 'd3';
import {createChoropleth} from './layers/choropleth';
import {createLegend} from './layers/legend';
//import {createSubstancesChoropleth} from './layers/substances/choropleth';
//import {createSubstancesTooltip} from './layers/substances/tooltip';
import {createOverlay} from './layers/overlay';
import {createTooltip} from './layers/tooltip';

// The data is already projected, it's expressed in px, between 0 and 960px
const cfg = {
  data: {
    height: 960,
    width: 960,
  },
  drawing: {
    // 1 is low: the image is blurry. Set 1.5 or more
    scale: 1.5,
  },
  svg: {height: 960, margin: 200, width: 960},
  zoom: {
    scale: {
      max: 16,
      min: 1,
    },
  },
};

export function makeMap(parent, dispatcher, data) {
  startLoading(parent);

  parent.html(null);

  const widths = {
    canvas: cfg.data.width * cfg.drawing.scale,
    data: cfg.data.width,
    svg: cfg.svg.width,
  };

  // 1. create the map as a canvas - for efficiency

  // As the canvas is set to 100% width, a window resize will modify the client
  // size of the canvas.
  // The dimensions here are not related to that effective size (client size).
  // The canvas width and height attributes correspond to the size of the image
  // ie. 1.5x scale, and 0-960 in data -> 1440 px square image
  // (the image will later be redimensioned, ie. reduced, to enter in the 100%
  // of its container - ie 400px)
  const canvas = parent.append('canvas');
  canvas.attr('width', widths.canvas).attr('height', widths.canvas);
  const context = canvas.node().getContext('2d');
  context.lineJoin = 'round';
  context.lineCap = 'round';
  const initTransform = zoomIdentity;

  createChoropleth(context, dispatcher, data, widths, initTransform);

  // 2. add an SVG layer over the canvas, for interactivity
  const svg = parent
    .append('svg')
    .style('position', 'absolute')
    .style('top', '0px')
    .style('left', '0px')
    .attr('viewBox', '0,0,' + widths.svg + ',' + widths.svg);

  createLegend(svg, dispatcher);
  createTooltip(svg, dispatcher, widths, initTransform);

  // 3. an invisible canvas overlay to capture interactions
  // The overlay is nearly 100% transparent. It's used to capture the mouse and
  // touch events. We use a canvas to be as near from the choropleth canvas as
  // possible and avoid any side-effect (e.g. replacing ".append('canvas')" by
  // ".append('svg')" adds some weird effects on the margin, maybe due to some
  // CSS)
  const overlay = parent
    .append('canvas')
    .style('position', 'absolute')
    .style('top', '0px')
    .style('left', '0px')
    .attr('width', widths.canvas)
    .attr('height', widths.canvas);
  createOverlay(overlay, dispatcher, data, widths, initTransform);

  // 4. Add zoom
  function constrain(transform, extent, translateExtent) {
    const dx0 = transform.invertX(extent[0][0]) - 0;
    const dx1 = transform.invertX(extent[1][0]) - canvas.node().clientWidth;
    const dy0 = transform.invertY(extent[0][1]) - 0;
    const dy1 = transform.invertY(extent[1][1]) - canvas.node().clientHeight;
    return transform.translate(
      // eslint-disable-next-line no-magic-numbers
      dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
      // eslint-disable-next-line no-magic-numbers
      dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
    );
  }

  const mapZoom = zoom()
    .scaleExtent([cfg.zoom.scale.min, cfg.zoom.scale.max])
    .constrain(constrain)
    //.translateExtent([[0, 0], [cfg.data.width, cfg.data.height]])
    //.on('end', zoomed);
    .on('end', zoomed);

  overlay.call(mapZoom);

  function zoomed() {
    // Fix the x and y values (from client/mouse space to canvas space - due to
    // stretch to 100% width
    const scale = widths.canvas / canvas.node().clientWidth;
    const transform = zoomIdentity
      .translate(event.transform.x * scale, event.transform.y * scale)
      .scale(event.transform.k);

    dispatcher.call('zoomed', null, transform);
    /* Remove? Simulate 'end' event
    const timeout = 40;
    setTimeout(() => {
      if (tr === zoomTransform(overlay.node())) {
        dispatcher.call('zoomed', null, tr);
      }
    }, timeout);*/
  }

  dispatcher.on('to-brazil-view.map', () => {
    canvas.call(mapZoom.transform, initTransform);
  });

  endLoading(parent);
}

/*
function createSubstances(svg, path, data, dispatcher, substance) {
  //const defaultSubstance = data.substancesLut['25'];
  svg.html(null);
  createSubstancesChoropleth(svg, path, data, dispatcher, substance);
  createFuFrontiers(svg, path, data);
  createSubstancesTooltip(svg, path, dispatcher, substance, mun);
}
*/

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
