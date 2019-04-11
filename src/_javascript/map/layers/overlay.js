import {polygonContains} from 'd3-polygon';

export function createOverlay(parent, dispatcher, data, canvas, dataWidth) {
  // The overlay is nearly 100% transparent. It's used to capture the mouse and
  // touch events
  const overlay = parent
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill-opacity', '0.01');

  overlay.on('mouseout', (ft, element) => {
    // invoke callbacks
    dispatcher.call('mun-mouseout');
  });
  overlay.on('click', () => {
    const mun = findMun(data, event, dataWidth, canvas);
    if (mun) {
      dispatcher.call('mun-click', null, mun);
    } else {
      dispatcher.call('mun-mouseout');
    }
  });
  overlay.on('mouseover mousemove', () => {
    const mun = findMun(data, event, dataWidth, canvas);
    if (mun) {
      dispatcher.call('mun-mouseover', null, mun);
    } else {
      dispatcher.call('mun-mouseout');
    }
  });
}

/* From d3-geo + adapted to planar polygons */
const containsGeometryType = {
  MultiPolygon: function(object, point) {
    const coordinates = object.coordinates;
    let idx = -1;
    const len = coordinates.length;
    while (++idx < len) {
      if (polygonContains(coordinates[idx][0], point)) {
        return true;
      }
    }
    return false;
  },
  Polygon: function(object, point) {
    return polygonContains(object.coordinates[0], point);
  },
};
function contains(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type)
    ? containsGeometryType[geometry.type](geometry, point)
    : false;
}
function findMun(data, event, dataWidth, canvas) {
  // In order to get back to the data dimensions, we need to know the size of
  // the canvas (client size), scale to the image size, and then divide by the
  // scale
  const clientToData = dim => (dim * dataWidth) / canvas.node().clientWidth;
  const dataX = clientToData(event.layerX);
  const dataY = clientToData(event.layerY);
  return data.mun.features.find(feature => {
    // TODO: if necessary, optimize looking first at the bounding box to avoid
    // more work
    // TODO: possibly, generate an index
    // TODO: evaluate picking https://bocoup.com/blog/2d-picking-in-canvas
    return contains(feature.geometry, [dataX, dataY]);
  });
}
