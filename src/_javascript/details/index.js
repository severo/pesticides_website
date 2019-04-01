import {makeTubesCocktail, makeTubesLimits} from './tubes';

const DETECTED_VALUE = 1e-10;

export function makeDetails(parent, dispatcher, view, state) {
  startLoading(parent);

  if ('mun' in state) {
    makeMun(parent, dispatcher, view, state.data, state.mun);
  } else {
    makeBrazil(parent, dispatcher, state.data);
  }

  dispatcher.on('to-brazil-view.details', () => {
    makeBrazil(parent, dispatcher, state.data);
  });

  dispatcher.on('to-mun-view.details', mun => {
    makeMun(parent, dispatcher, view, state.data, mun);
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

function makeMun(parent, dispatcher, view, data, mun) {
  if (view === 'limits') {
    makeLimits(parent, dispatcher, mun, data);
  } else if (view === 'substances') {
    // init
    const defaultSubstance = data.substancesLut['25'];
    makeSubstance(parent, dispatcher, mun, data, defaultSubstance);

    dispatcher.on('substance-selected', substance =>
      makeSubstance(parent, dispatcher, mun, data, substance)
    );
  } else {
    makeCocktail(parent, dispatcher, mun, data);
  }
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

  // map1Number should always be present - NaN if no tests
  if (isNaN(mun.properties.map1Number)) {
    parent
      .append('header')
      .html(
        '<strong class="is-size-4">' +
          'No data</strong> about agrotoxics inside drinking water in ' +
          mun.properties.name +
          '.'
      );
  } else if (mun.properties.map1Number === 0) {
    parent
      .append('header')
      .html(
        '<strong class="is-size-4">' +
          'No agrotoxics</strong> detected inside drinking water in ' +
          mun.properties.name +
          '.'
      );
  } else {
    parent
      .append('header')
      .html(
        '<strong class="is-size-4"><span class="is-size-2">' +
          mun.properties.map1Number +
          '</span> agrotoxic(s)</strong> detected in drinking water in ' +
          mun.properties.name +
          '.'
      );

    const hhceSubstances = mun.properties.tests.filter(
      sub => sub.substance.isHhce && sub.max > 0
    );
    if (hhceSubstances.length > 0) {
      makeTubesCocktail(
        parent,
        hhceSubstances,
        '<strong class="is-size-4">' +
          hhceSubstances.length +
          '</strong> out of ' +
          mun.properties.map1Number +
          ': associated with chronic dieses such as cancer',
        'purple'
      );
      const otherSubstances = mun.properties.tests.filter(
        sub => !sub.substance.isHhce && sub.max > 0
      );
      if (otherSubstances.length > 0) {
        makeTubesCocktail(
          parent,
          otherSubstances,
          '<strong class="is-size-4">' +
            otherSubstances.length +
            '</strong> out of ' +
            mun.properties.map1Number +
            ': other pesticides',
          'red'
        );
      }
    } else {
      makeTubesCocktail(parent, mun.properties.tests, '', 'red');
    }
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
          mun.properties.number.detected +
          ' agrotoxic(s)</strong> detected above legal limit in drinking water in ' +
          mun.properties.name +
          '.'
      );
    makeTubesLimits(parent, mun.properties.name, mun, data);
  }
}

function makeSubstance(parent, dispatcher, mun, data, substance) {
  parent.html(null);
  makeHeader(parent, mun.properties.name, mun.properties.fuName);
  parent
    .append('p')
    .html(
      '<strong>Population:</strong> ' +
        (+mun.properties.population).toLocaleString('pt-BR')
    );

  if (!('tests' in mun.properties)) {
    parent
      .append('header')
      .html(
        substance.name +
          ' has never been tested  in ' +
          mun.properties.name +
          '.'
      );
  } else {
    const subst = mun.properties.tests.filter(
      sub => sub.substance.code === substance.code
    );
    if (subst.length === 0) {
      parent
        .append('header')
        .html(
          substance.name +
            ' has never been tested  in ' +
            mun.properties.name +
            '.'
        );
    } else {
      const tests = subst[0].tests;
      parent
        .append('header')
        .html(
          '<strong>' +
            tests.length +
            ' measurement(s)</strong> for ' +
            substance.name +
            ' in ' +
            mun.properties.name +
            '. The detail is:'
        );
      const ul = parent.append('ul');
      // eslint-disable-next-line no-inner-declarations
      function pct(val) {
        return (
          // eslint-disable-next-line no-magic-numbers
          (Math.floor((10000 * val) / tests.length) / 100).toLocaleString(
            'pt-BR'
          ) + '%'
        );
      }
      const detected = tests.filter(test => test > 0).length;
      ul.append('li').text(detected + ' detections (' + pct(detected) + ')');
      const equal = tests.filter(test => test === substance.limit).length;
      ul.append('li').text(
        equal +
          ' measurements exactly equal to the legal limit (' +
          pct(equal) +
          ')'
      );
      const above = tests.filter(test => test > substance.limit).length;
      ul.append('li').text(
        above + ' measurements above the legal limit (' + pct(above) + ')'
      );
      if (subst[0].max && subst[0].max > DETECTED_VALUE) {
        ul.append('li').text(
          'Max detected concentration: ' +
            subst[0].max.toLocaleString('pt-BR') +
            ' μg/L'
        );
      }
    }
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
