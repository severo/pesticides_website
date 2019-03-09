export const cfg = {
  countries: {
    geometriesNumber: 255,
    integrityHash:
      'sha384-5SdXldiqi3bZIJd1lTR03wlr/BcQZtufaPk5GLSD6Pqq4OtYj37y46YgetKdOHHr',
    topojsonKey: 'countries',
    type: 'topojson',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/countries-simplified-0_5.topojson',
  },
  municipalities: {
    geometriesNumber: 5570,
    integrityHash:
      'sha384-VFdBqXvo0dqch+0XxcCuJwSv2GPRd5KVqV78wHeLOp8XulVaDU1QKiUcYpCCHKOG',
    topojsonKey: 'municipios',
    type: 'topojson',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/municipios.topojson',
  },
  municipalitiesPopulation: {
    integrityHash:
      'sha384-J+33p3MqQsCeW5Ld7ZBHhQUl5p5RqRTdfCGh5fKORM4vmbCxifAYlYzWdnTpBZlX',
    rowsNumber: 5570,
    type: 'csv',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/population.csv',
  },
  states: {
    geometriesNumber: 27,
    integrityHash:
      'sha384-ouQz9pxNn8qAzuMhLlb5tBC+H8tZ7nniJlpcWSVLHwx7QKja0yPvC08KJSqiTtvi',
    topojsonKey: 'estados',
    type: 'topojson',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/estados.topojson',
  },
  statistics: {
    integrityHash:
      'sha384-1mMiVJ4KDmhyjlz86hL3dd+AYo/ShdE/2L8iW5nCdsUHlgsMt9ZS/PTVg12LyTZM',
    rowsNumber: 2242,
    type: 'csv',
    url:
      'https://raw.githubusercontent.com/severo/data_brazil/master/data_by_municipality_for_maps.csv',
  },
};
