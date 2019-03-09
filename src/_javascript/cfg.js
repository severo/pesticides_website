const cfg = {
  arrowMarkerSize: 8,
  arrowStroke: '#555',
  datasets: {
    municipalities: {
      integrityHash:
        'sha384-VFdBqXvo0dqch+0XxcCuJwSv2GPRd5KVqV78wHeLOp8XulVaDU1QKiUcYpCCHKOG',
      municipalitiesNumber: 5570,
      url:
        'https://raw.githubusercontent.com/severo/data_brazil/master/municipios.topojson',
    },
    states: {
      integrityHash:
        'sha384-ouQz9pxNn8qAzuMhLlb5tBC+H8tZ7nniJlpcWSVLHwx7QKja0yPvC08KJSqiTtvi',
      statesNumber: 27,
      url:
        'https://raw.githubusercontent.com/severo/data_brazil/master/estados.topojson',
    },
    statistics: {
      integrityHash:
        'sha384-1mMiVJ4KDmhyjlz86hL3dd+AYo/ShdE/2L8iW5nCdsUHlgsMt9ZS/PTVg12LyTZM',
      rowsNumber: 2242,
      url:
        'https://raw.githubusercontent.com/severo/data_brazil/master/data_by_municipality_for_maps.csv',
    },
  },
};

export {cfg};
