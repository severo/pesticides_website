import {dispatch} from 'd3-dispatch';
import {loadData} from './data';
import {makeDetails} from './details';
import {makeMap} from './map';
//import {makeSearch} from './search';
import {select} from 'd3-selection';

const dispatcher = dispatch(
  'data-loaded',
  'mun-click',
  'mun-mouseover',
  'mun-mouseout'
);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded.search', data => {
  // Selectr is loaded from a <script> tag in the index.html file, not from a
  // module
  const selectrData = data.fu.features.map(fu => {
    return {
      children: data.mun.features
        .filter(mun => mun.properties.fuCode === fu.properties.fuCode)
        .map(ft => {
          return {text: ft.properties.name, value: ft.properties.ibgeCode};
        }),
      text: fu.properties.fu,
    };
  });
  new window.Selectr('#mun-search', {
    data: selectrData,
  });
  //makeSearch(select('section#search'), dispatcher, data);
});
dispatcher.on('data-loaded.map', data => {
  makeMap(select('section#map'), dispatcher, data);
});

//
dispatcher.on('mun-click.details', mun => {
  makeDetails(select('section#details'), dispatcher, mun);
});
