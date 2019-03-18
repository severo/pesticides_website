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
  'mun-mouseout',
  'mun-search-change',
  'mun-search-select'
);

// Asynchronous (promise)
loadData(dispatcher);

// Create the layout
dispatcher.on('data-loaded.search', data => {
  // Selectr is loaded from a <script> tag in the index.html file, not from a
  // module
  const munSearchData = data.fu.features.map(fu => {
    return {
      children: data.mun.features
        .filter(mun => mun.properties.fuCode === fu.properties.fuCode)
        .map(ft => {
          return {text: ft.properties.name, value: ft.properties.ibgeCode};
        }),
      text: fu.properties.fu,
    };
  });
  const munSearch = new window.Selectr('#mun-search', {
    clearable: true,
    data: munSearchData,
    placeholder: null,
  });

  munSearch.on('selectr.select', option => {
    // TODO: get the data more efficiently through a lookup table?
    const mun = data.mun.features.filter(
      ft => ft.properties.ibgeCode === option.value
    )[0];
    dispatcher.call('mun-search-select', null, mun);
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
dispatcher.on('mun-search-select.details', mun => {
  makeDetails(select('section#details'), dispatcher, mun);
});
