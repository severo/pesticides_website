import {makeTubes} from './tubes';

export function makeDetails(parent, dispatcher, data) {
  startLoading(parent);

  makeUpperLayerBrazil(parent, dispatcher, data);

  dispatcher.on('to-brazil-view.details', brazilData => {
    makeUpperLayerBrazil(parent, dispatcher, data);
  });

  dispatcher.on('to-mun-view.details', mun => {
    makeUpperLayer(parent, dispatcher, mun, data);
  });

  endLoading(parent);
}

function makeUpperLayerBrazil(parent, dispatcher, data) {
  parent.html(null);
  makeHeader(parent, 'Brazil');
  parent
    .append('p')
    .html('[work in progress... show a message - search or click]');
}

function makeUpperLayer(parent, dispatcher, mun, data) {
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
          ' different agrotoxics</strong>.'
      );
    makeTubes(parent, name, mun, data);
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
