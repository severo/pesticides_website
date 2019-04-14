import {event} from 'd3-selection';
import {polygonContains} from 'd3-polygon';

export function createOverlay(
  overlay,
  dispatcher,
  data,
  widths,
  initTransform
) {
  function updateEvents(transform) {
    overlay.on('mouseout', () => {
      dispatcher.call('mun-mouseout');
    });
    overlay.on('click', () => {
      const mun = findMun(overlay, data, widths, transform, event);
      if (mun) {
        dispatcher.call('mun-click', null, mun);
      } else {
        dispatcher.call('mun-mouseout');
      }
    });
    overlay.on('mouseover mousemove', () => {
      const mun = findMun(overlay, data, widths, transform, event);
      if (mun) {
        dispatcher.call('mun-mouseover', null, mun);
      } else {
        dispatcher.call('mun-mouseout');
      }
    });
  }

  updateEvents(initTransform);
  dispatcher.on('zoomed.overlay', state => {
    updateEvents(state.transform);
  });
  /*dispatcher.on('zoomed.overlay', transform => {
    context.save();
    context.translate(clientToData(transform.x), clientToData(transform.y));
    //context.translate(transform.k, transform.k);
    context.scale(transform.k, transform.k);
    context.restore();

    /*const clientPoint = transform.invert([
      clientToData(transform.x),
      clientToData(transform.y),
    ]);

    const dataX = clientPoint[0];
    const dataY = clientPoint[1];
    overlay.attr(
      'transform',
      'translate(' + dataX + ',' + dataY + ') scale(' + transform.k + ')'
    );*/
  //overlay.attr('transform', transform);
  //});

  return overlay;
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
function findMun(overlay, data, widths, transform, ev) {
  const clientPoint = [ev.layerX, ev.layerY];
  const zoomedCanvasPoint = clientPoint.map(
    dim => (dim * widths.canvas) / overlay.node().clientWidth
  );
  const canvasPoint = transform.invert(zoomedCanvasPoint);
  const dataPoint = canvasPoint.map(dim => (dim * widths.data) / widths.canvas);
  return data.mun.features.find(feature => {
    // TODO: if necessary, optimize looking first at the bounding box to avoid
    // more work
    // TODO: possibly, generate an index
    // TODO: evaluate picking https://bocoup.com/blog/2d-picking-in-canvas
    return contains(feature.geometry, dataPoint);
  });
}
