import {polygonContains} from 'd3';
import {polylabel} from './polylabel';

function isBboxInsidePolygon(bbox, polygon) {
  // TODO: ensure that all the text is inside the polygon
  // (the four corners could be inside, whereas the polygon
  // intersects with one of the borders of the bbox)
  return (
    polygonContains(polygon, [bbox.x, bbox.y]) &&
    polygonContains(polygon, [bbox.x + bbox.width, bbox.y]) &&
    polygonContains(polygon, [bbox.x, bbox.y + bbox.height]) &&
    polygonContains(polygon, [bbox.x + bbox.width, bbox.y + bbox.height])
  );
}

function add(name, xx, yy, parent, cfg) {
  return parent
    .append('text')
    .attr('x', xx)
    .attr('y', yy)
    .attr('dy', '.3em') // See http://lea.verou.me/2013/03/easily-center-text-vertically-with-svg/
    .attr('text-anchor', 'middle')
    .attr('style', 'text-transform: uppercase;')
    .attr('font-size', cfg.fontSize)
    .attr('fill', cfg.color)
    .text(name);
}
export function placeLabelInPolygon(
  feature,
  projection,
  width,
  height,
  parent,
  shortLabelText,
  longLabelText,
  cfg
) {
  const polygon = projectAndClipFeature(feature, projection, width, height)
    .coordinates;

  // find the center using https://github.com/mapbox/polylabel/
  if (polygon[0].length > 0) {
    // Use only the largest polygon, if MultiPolygon

    const center = polylabel(polygon, 1.0);
    if (polygonContains(polygon[0], center)) {
      // if the center is inside the map, try to add the label:

      // 1. the long label
      let label = add(longLabelText, center[0], center[1], parent, cfg);
      let bbox = label.node().getBBox();

      // 2. if it does not enter, the short label
      if (!isBboxInsidePolygon(bbox, polygon[0])) {
        label.remove();
        label = add(shortLabelText, center[0], center[1], parent, cfg);
        bbox = label.node().getBBox();

        // 3. if it does not enter either, do not show any label
        if (!isBboxInsidePolygon(bbox, polygon[0])) {
          label.remove();
        }
      }
    }
  }
}

function projectAndClipFeature(feature, projection, width, height) {
  const multiPolygon = feature.geometry;
  // convert the geometry (multipolygon) to only the largest polygon
  const polygon = getPolygonFromMultiPolygon(multiPolygon);
  // project and clip the polygon to the map extent
  return clipProjectedPolygon(
    width,
    height,
    projectPolygon(polygon, projection)
  );
}

function getPolygonFromMultiPolygon(multiPolygon) {
  // first let's check that the geometry is a multipolygon (that's true for all "countries")
  if (multiPolygon.type !== 'MultiPolygon') {
    throw 'Error: we expected a MultiPolygon geometry, and got a ' +
      multiPolygon.type +
      ' geometry.';
  }
  // and that it contains at least one polygon
  if (multiPolygon.coordinates.length === 0) {
    throw 'Error: we expected at least one polygon inside the MultiPolygon geometry and got zero.';
  }
  // we find the polygon with largest number of points (more robust than computing the area)
  const polygon = {
    coordinates: multiPolygon.coordinates.sort(
      (pol1, pol2) => pol1[0].length < pol2[0].length
    )[0],
    type: 'Polygon',
  };
  return polygon;
}

function projectPolygon(polygon, projection) {
  return {
    coordinates: polygon.coordinates.map(pol =>
      pol.map(point => projection(point))
    ),
    type: 'Polygon',
  };
}

function clipProjectedPolygon(width, height, polygon) {
  // we simply replace the coordinates out of extent by the max or min value
  const points = polygon.coordinates[0].map(coords => {
    /* eslint-disable id-length */
    let x = coords[0];
    let y = coords[1];
    if (x < 0) {
      x = 0;
    } else if (x > width) {
      x = width;
    }
    if (y < 0) {
      y = 0;
    } else if (y > height) {
      y = height;
    }
    return [x, y];
    /* eslint-enable id-length */
  });

  return {
    coordinates: [points],
    type: 'Polygon',
  };
}
