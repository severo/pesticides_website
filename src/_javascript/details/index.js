import {makeTubesCocktail, makeTubesLimits} from './tubes';

export function makeDetails(parent, dispatcher, view, data) {
  startLoading(parent);

  makeBrazil(parent, dispatcher, data);

  dispatcher.on('to-brazil-view.details', brazilData => {
    makeBrazil(parent, dispatcher, data);
  });

  dispatcher.on('to-mun-view.details', mun => {
    if (view === 'limits') {
      makeLimits(parent, dispatcher, mun, data);
    } else {
      makeCocktail(parent, dispatcher, mun, data);
    }
  });

  endLoading(parent);
}

function makeBrazil(parent, dispatcher, data) {
  parent.html(null);
  makeHeader(parent, 'Brazil');
  parent
    .append('p')
    .html('[work in progress... show a message - search or click]');
}

function makeCocktail(parent, dispatcher, mun, data) {
  parent.html(null);
  makeHeader(parent, mun.properties.name, mun.properties.fuName);
  parent
    .append('p')
    .html(
      '<strong>Population:</strong> ' +
        (+mun.properties.population).toLocaleString('pt-BR')
    );

  if (!('number' in mun.properties)) {
    parent
      .append('header')
      .html(
        'No data about agrotoxics inside drinking water in ' +
          mun.properties.name +
          '.'
      );
  } else if (mun.properties.number.detected === 0) {
    parent
      .append('header')
      .html(
        'No agrotoxics detected inside drinking water in ' +
          mun.properties.name +
          '.'
      );
  } else {
    parent
      .append('header')
      .html(
        'The drinking water in ' +
          name +
          ' contains <strong>' +
          mun.properties.number.detected +
          ' agrotoxic(s)</strong>.'
      );
    makeTubesCocktail(parent, name, mun, data);
  }
}

function makeLimits(parent, dispatcher, mun, data) {
  parent.html(null);
  makeHeader(parent, mun.properties.name, mun.properties.fuName);
  parent
    .append('p')
    .html(
      '<strong>Population:</strong> ' +
        (+mun.properties.population).toLocaleString('pt-BR')
    );

  if (!('number' in mun.properties)) {
    parent
      .append('header')
      .html(
        'No data about agrotoxics above legal limit in ' +
          mun.properties.name +
          '.'
      );
  } else if (mun.properties.number.supBr === 0) {
    parent
      .append('header')
      .html(
        'No agrotoxics detected above legal limit in ' +
          mun.properties.name +
          '.'
      );
  } else {
    parent
      .append('header')
      .html(
        '<strong>' +
          mun.properties.number.supBr +
          ' agrotoxic(s)</strong> detected above legal limit in ' +
          mun.properties.name +
          '.'
      );
    makeTubesLimits(parent, name, mun, data);
  }
}

function makeHeader(parent, title, subtitle) {
  const header = parent.append('header').attr('id', 'idCard');

  header.append('h2').text(title);

  if (subtitle) {
    const fu = header.append('h3');
    // TODO: add an icon
    fu.append('span').text('📌 ' + subtitle);
  }
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
