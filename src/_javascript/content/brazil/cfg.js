export const cfg = {
  countries: {
    fill: '#DDD',
    stroke: '#BBB',
    strokeWidth: 1,
  },
  defaultHeight: 500,
  defaultWidth: 500,
  projection: {
    fitMargin: 20,
    type: 'epsg5530',
  },
  seaBackground: {
    fill: '#e3eef9',
    stroke: 'none',
  },
  shadow: {
    fill: '#F8F8F8',
    stroke: '#BBB',
    strokeWidth: 1,
    svgFilter: {
      id: 'filter1',
      stdDeviation: 3,
      type: 'feDropShadow',
    },
  },
};
