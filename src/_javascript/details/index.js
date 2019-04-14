import {makeTubesCocktail, makeTubesLimits} from './tubes';
import {MAP2} from '../data';

//const DETECTED_VALUE = 1e-10;

export function makeDetails(parent, dispatcher, view, initState) {
  startLoading(parent);

  if ('mun' in initState) {
    makeMun(parent, dispatcher, view, initState);
  } else {
    makeBrazil(parent, dispatcher, view, initState);
  }

  dispatcher.on('to-brazil-view.details', () => {
    makeBrazil(parent, dispatcher, view, {data: initState.data});
  });

  dispatcher.on('to-mun-view.details', mun => {
    makeMun(parent, dispatcher, view, {data: initState.data, mun: mun});
  });

  endLoading(parent);
}

function makeBrazil(parent, dispatcher, view, state) {
  const main = parent.select('#details-main');
  main.html(null);

  if (view === 'limits') {
    makeHeader(main, '{{details.limits.brazil.title}}');
    main
      .append('p')
      .classed('brazil', true)
      .html('{{details.limits.brazil.content}}');
    makeLimitsToOtherViews(parent, dispatcher, state);
    makeToArticle(parent);
    makeSource(parent);
  } else {
    makeHeader(main, '{{details.cocktail.brazil.title}}');
    main
      .append('p')
      .classed('brazil', true)
      .html('{{details.cocktail.brazil.content}}');
    makeCocktailToOtherViews(parent, dispatcher, state);
    makeToArticle(parent);
    makeSource(parent);
  }
}

function addLevelItem(parent, heading, title) {
  const level = parent
    .append('div')
    .classed('level-item has-text-centered', true);
  level
    .append('p')
    .classed('heading', true)
    .text(heading);
  level
    .append('p')
    .classed('title', true)
    .text(title);
  return level;
}

function makeMun(parent, dispatcher, view, state) {
  const main = parent.select('#details-main');

  main.html(null);
  makeHeader(main, state.mun.properties.name, state.mun.properties.fuName);

  /*main
    .append('p')
    .html(
      '<strong>{{details.population}}</strong> ' +
        (+state.mun.properties.population).toLocaleString('{{locale}}')
    );
*/
  if (view === 'limits') {
    makeLimits(main, dispatcher, state.mun, state.data);
    makeLimitsToOtherViews(parent, dispatcher, state);
    makeToArticle(parent);
    makeSource(parent);
    /*} else if (view === 'substances') {
    // init
    const defaultSubstance = data.substancesLut['25'];
    makeSubstance(main, dispatcher, mun, data, defaultSubstance);

    dispatcher.on('substance-selected', substance =>
      makeSubstance(main, dispatcher, mun, data, substance)
    );*/
  } else {
    makeCocktail(main, dispatcher, state.mun, state.data);
    makeCocktailToOtherViews(parent, dispatcher, state);
    makeToArticle(parent);
    makeSource(parent);
  }
}

function makeCocktail(parent, dispatcher, mun, data) {
  const level = parent.append('nav').classed('level is-mobile', true);
  addLevelItem(
    level,
    '{{details.population}}',
    (+mun.properties.population).toLocaleString('{{locale}}')
  );

  // map1Number should always be present - NaN if no tests
  if (isNaN(mun.properties.map1Number)) {
    addLevelItem(
      level,
      '{{details.cocktail.detected}}',
      '{{details.cocktail.nodata0}}'
    );
    parent
      .append('header')
      .html(
        '<span class="is-size-4">{{details.cocktail.nodata1}}</span>' +
          ' {{details.cocktail.nodata2}} ' +
          mun.properties.name +
          '.'
      );
  } else if (mun.properties.map1Number === 0) {
    addLevelItem(
      level,
      '{{details.cocktail.detected}}',
      mun.properties.map1Number
    );
    parent
      .append('header')
      .html(
        '<span class="is-size-4">{{details.cocktail.nodetection1}}</span>' +
          ' {{details.cocktail.nodetection2}} ' +
          mun.properties.name +
          '.'
      );
  } else {
    addLevelItem(
      level,
      '{{details.cocktail.detected}}',
      mun.properties.map1Number
    );

    parent
      .append('header')
      .html(
        '<span class="is-size-4">' +
          mun.properties.map1Number +
          '</span> {{details.cocktail.detections1}}' +
          ' {{details.cocktail.detections2}} ' +
          mun.properties.name +
          '.'
      );

    const list = parent.append('ul');
    const hhceSubstances = mun.properties.tests.filter(
      sub => sub.substance.isHhce && sub.max > 0
    );
    makeTubesCocktail(
      list.append('li'),
      hhceSubstances,
      '<span class="is-size-4">' +
        hhceSubstances.length +
        '</span> {{details.cocktail.hhce2}} ' +
        '<strong>{{details.cocktail.hhce3}}</strong> ' +
        '{{details.cocktail.hhce4}}',
      'hhce'
    );
    const otherSubstances = mun.properties.tests.filter(
      sub => !sub.substance.isHhce && sub.max > 0
    );
    if (otherSubstances.length > 0) {
      makeTubesCocktail(
        list.append('li'),
        otherSubstances,
        '<span class="is-size-4">' +
          otherSubstances.length +
          '</span> {{details.cocktail.nohhce2}}',
        'no-hhce'
      );
    }
  }
}

function makeLimits(parent, dispatcher, mun, data) {
  const level = parent.append('nav').classed('level is-mobile', true);
  addLevelItem(
    level,
    '{{details.population}}',
    (+mun.properties.population).toLocaleString('{{locale}}')
  );

  // map2Category should always be present
  if (mun.properties.map2Category === MAP2.CATEGORY.NO_TEST) {
    parent
      .append('header')
      .html(
        '<span class="is-size-4">' +
          '{{details.limits.nodata1}}</span> {{details.limits.nodata2}} ' +
          mun.properties.name +
          '.'
      );
  } else if (mun.properties.map2Category === MAP2.CATEGORY.BELOW) {
    parent
      .append('header')
      .html(
        '<span class="is-size-4">' +
          '{{details.limits.nodetection1}}</span> {{details.limits.nodetection2}} ' +
          mun.properties.name +
          '.'
      );
  } else {
    const supBrSubstances = mun.properties.tests.filter(
      sub => sub.map2Category === MAP2.CATEGORY.SUP_BR
    );
    if (supBrSubstances.length > 0) {
      makeTubesLimits(
        parent,
        supBrSubstances,
        '<span class="is-size-4">' +
          supBrSubstances.length +
          '</span> {{details.limits.detectionsbr}} ' +
          mun.properties.name,
        'cat-' + MAP2.CATEGORY.SUP_BR
      );
    }
    const supEuSubstances = mun.properties.tests.filter(
      sub => sub.map2Category === MAP2.CATEGORY.SUP_EU
    );
    if (supEuSubstances.length > 0) {
      makeTubesLimits(
        parent,
        supEuSubstances,
        '<span class="is-size-4">' +
          supEuSubstances.length +
          '</span> {{details.limits.detectionseu}}',
        'cat-' + MAP2.CATEGORY.SUP_EU
      );
    }
  }
}

/*function makeSubstance(parent, dispatcher, mun, data, substance) {
  parent.html(null);
  makeHeader(parent, mun.properties.name, mun.properties.fuName);
  parent
    .append('p')
    .html(
      '<strong>{{details.population}}</strong> ' +
        (+mun.properties.population).toLocaleString('{{locale}}')
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
            '{{locale}}'
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
            subst[0].max.toLocaleString('{{locale}}') +
            ' μg/L'
        );
      }
    }
  }
}
*/
function makeHeader(parent, title, subtitle) {
  const header = parent.append('header').attr('id', 'idCard');

  header.append('h2').text(title);

  if (subtitle) {
    const fu = header.append('h3');
    // TODO: add an icon
    fu.append('span').text('📌 ' + subtitle);
  }
}

function makeCocktailToOtherViews(parent, dispatcher, state) {
  const par = parent
    .select('#details-footer #to-other-views')
    .html(null)
    .append('p');
  par.append('span').text('{{details.cocktail.footer.tolimits1}} ');
  const suffix =
    'mun' in state && state.mun
      ? '{{details.cocktail.footer.tolimits3mun}}' + state.mun.properties.name
      : '';
  par
    .append('a')
    .attr('href', '#_')
    .text('{{details.cocktail.footer.tolimits2}}' + suffix)
    .on('click', () => {
      dispatcher.call('make-app-limits', null, state);
    });
  par.append('span').text('.');
}

function makeLimitsToOtherViews(parent, dispatcher, state) {
  const par = parent
    .select('#details-footer #to-other-views')
    .html(null)
    .append('p');
  par.append('span').text('{{details.limits.footer.tococktail1}} ');
  const suffix =
    'mun' in state && state.mun
      ? '{{details.limits.footer.tococktail3mun}}' + state.mun.properties.name
      : '';
  par
    .append('a')
    .attr('href', '#_')
    .text('{{details.limits.footer.tococktail2}}' + suffix)
    .on('click', () => {
      dispatcher.call('make-app-cocktail', null, state);
    });
  par.append('span').text('.');
}

function makeToArticle(parent) {
  const par = parent
    .select('#details-footer #to-article')
    .html(null)
    .append('p');
  par.append('span').text('{{details.cocktail.footer.toarticle1}} ');
  par
    .append('a')
    .attr(
      'href',
      'https://portrasdoalimento.info/2019/04/12/conheca-os-27-agrotoxicos-encontrados-na-agua-que-abastasse-as-cidades-do-brasil/'
    )
    .attr('target', '_blank')
    .text('{{details.cocktail.footer.toarticle2}}');
  par.append('span').text('{{details.cocktail.footer.toarticle3}}');
}

function makeSource(parent) {
  const par = parent.select('#details-footer #source').html(null);
  par.append('h4').html('{{details.cocktail.footer.source1}}');
  const ul = par.append('ul');
  const li1 = ul.append('li');
  li1.append('span').text('{{details.cocktail.footer.source21}}');
  li1
    .append('a')
    .attr('href', 'http://dados.gov.br/dataset/controle-semestral')
    .attr('target', '_blank')
    .text('{{details.cocktail.footer.source22}}');
  li1.append('span').text('{{details.cocktail.footer.source23}}');
  const li2 = ul.append('li');
  li2.append('span').text('{{details.cocktail.footer.source31}}');
  li2
    .append('a')
    .attr(
      'href',
      'ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2017/'
    )
    .attr('target', '_blank')
    .text('{{details.cocktail.footer.source32}}');
  li2.append('span').text('{{details.cocktail.footer.source33}}');
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
