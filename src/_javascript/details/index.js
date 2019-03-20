import * as d3Path from 'd3-path';

export function makeDetails(parent, dispatcher, mun) {
  startLoading(parent);

  // Clean existing contents
  // TODO: be more clever?
  parent.html(null);

  makeHeader(parent, mun);
  /* eslint-disable  */

  parent
    .append('p')
    .html(
      '<strong>Population:</strong> ' +
        (+mun.properties.population).toLocaleString('pt-BR')
    );

  // TODO: use real values
  const values = shuffle([
    0,
    0,
    12,
    82,
    0,
    83,
    99,
    15,
    0,
    0,
    56,
    84,
    0,
    0,
    0,
    19,
    83,
    25,
    80,
    0,
    30,
    42,
    0,
    70,
    0,
    0,
    32,
  ]);
  const parameters = [
    'DDT + DDD + DDE',
    'Endossulfan (a, ß e sais)',
    'Diuron',
    'Parationa Metílica',
    'Alaclor',
    'Pendimentalina',
    'Glifosato + AMPA',
    'Simazina',
    'Trifluralina',
    'Endrin',
    'Terbufós',
    'Metolacloro',
    'Clordano',
    'Carbendazim + benomil',
    'Lindano (gama HCH)',
    'Molinato',
    'Tebuconazol',
    'Permetrina',
    'Profenofós',
    'Aldicarbe + Aldicarbesulfona + Aldicarbesulfóxido',
    'Clorpirifós + clorpirifós-oxon',
    'Carbofurano',
    '2,4 D + 2,4,5 T',
    'Atrazina',
    'Aldrin + Dieldrin',
    'Metamidofós',
    'Mancozebe',
  ];
  parent
    .append('p')
    .html(
      '<strong>' +
        values.slice(0, 9).filter(p => p !== 0).length +
        '</strong> of the 9 <strong>worse</strong> agrotoxics have been detected.'
    );
  makeTubes(parent, values.slice(0, 9), parameters.slice(0, 9), [
    '#8F0078',
    '#770064',
  ]);
  parent
    .append('p')
    .html(
      'Also <strong>' +
        values.slice(9, 27).filter(p => p !== 0).length +
        '</strong> among the other 18 agrotoxics have been detected.'
    );
  makeTubes(parent, values.slice(9, 18), parameters.slice(9, 18), [
    '#c63400',
    '#A92B00',
  ]); //#9e3400']);
  makeTubes(parent, values.slice(18, 27), parameters.slice(18, 27), [
    '#007D73',
    '#006860',
  ]);

  endLoading(parent);
}

function makeTubes(parent, values, parameters, colors) {
  function getY(value) {
    return 1 - value / 100;
  }

  const tubes = parent.append('div').classed('tubes', true);
  const vpW = 300;
  const vpH = 1000;

  const svg = tubes
    .selectAll('abbr')
    .data(values)
    .enter()
    .append('abbr')
    .attr(
      'title',
      (d, i) =>
        parameters[i] + ' - ' + (d / 40).toLocaleString('pt-BR') + ' ppb'
    )
    .append('svg')
    .attr('width', 15)
    .attr('height', 50)
    .attr('viewBox', '0,0,' + vpW + ',' + vpH + '');

  const wid = (1.5 * vpW) / 10;
  const hei = vpH - 3 * wid;
  const mid = vpW / 2;
  const colg_a = '#e7f3f8';
  const colg_b = '#bfdde3';
  const colg_c = '#cce8eb';
  const colg_d = '#b1d8df';

  const da = d3Path.path();
  da.rect(0, 0, mid, wid);
  svg
    .append('path')
    .attr('fill', colg_a)
    .attr('d', da.toString());
  const db = d3Path.path();
  db.rect(mid, 0, mid, wid);
  svg
    .append('path')
    .attr('fill', colg_b)
    .attr('d', db.toString());
  const dc = d3Path.path();
  dc.moveTo(wid, wid);
  dc.lineTo(wid, hei + wid);
  dc.quadraticCurveTo(wid, hei + 3 * wid, mid, hei + 3 * wid);
  dc.lineTo(mid, wid);
  dc.closePath();
  svg
    .append('path')
    .attr('fill', colg_c)
    .attr('d', dc.toString());
  const dd = d3Path.path();
  dd.moveTo(2 * mid - wid, wid);
  dd.lineTo(2 * mid - wid, hei + wid);
  dd.quadraticCurveTo(2 * mid - wid, hei + 3 * wid, mid, hei + 3 * wid);
  dd.lineTo(mid, wid);
  dd.closePath();
  svg
    .append('path')
    .attr('fill', colg_d)
    .attr('d', dd.toString());

  const coll_a = colors[0];
  const coll_b = colors[1];

  svg
    .append('path')
    .attr('fill', coll_a)
    .attr('d', pes => {
      if (pes) {
        const pesY = 2 * wid + getY(pes) * hei;
        const dlb = d3Path.path();
        dlb.moveTo(2 * mid - 2 * wid, pesY);
        dlb.lineTo(2 * mid - 2 * wid, hei + wid);
        dlb.quadraticCurveTo(
          2 * mid - 2 * wid,
          hei + 2 * wid,
          mid,
          hei + 2 * wid
        );
        dlb.lineTo(mid, pesY);
        dlb.closePath();
        return dlb.toString();
      } else return '';
    });
  svg
    .append('path')
    .attr('fill', coll_b)
    .attr('d', pes => {
      if (pes) {
        const pesY = 2 * wid + getY(pes) * hei;
        const dlb = d3Path.path();
        dlb.moveTo(2 * wid, pesY);
        dlb.lineTo(2 * wid, hei + wid);
        dlb.quadraticCurveTo(2 * wid, hei + 2 * wid, mid, hei + 2 * wid);
        dlb.lineTo(mid, pesY);
        dlb.closePath();
        return dlb.toString();
      } else return '';
    });
}

function makeHeader(parent, mun) {
  const header = parent.append('header').attr('id', 'idCard');

  header.append('h2').text(mun.properties.name);

  const fu = header.append('h3');
  fu.append('span')
    .classed('icon', true)
    .append('i')
    .classed('fas fa-map-marker-alt', true);
  fu.append('span').text(mun.properties.fuName);
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}

function shuffle(array) {
  let m = array.length;
  let t;
  let i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
/* eslint-enable  */
