//import {appendControls} from './controls';
import {dispatch} from 'd3-dispatch';
import {loadData} from './data';
import {makeMap} from './map';
import {makeSearch} from './search';
import {select} from 'd3-selection';

// TODO: cfg
const dispatcher = dispatch(
  'data-loaded',
  'mun-click',
  'mun-mouseover',
  'mun-mouseout',
  'state-changed'
  /*'view-changed',
  'view-control-changed',
  'zoom-control-changed'*/
);

const state = {
  data: {},
};
dispatcher.on('data-loaded.state', data => {
  state.data = data;
  console.log('Data has been loaded');
  dispatcher.call('state-changed', this, state);
});
/*dispatcher.on('view-control-changed.state', data => {
  state.view = data.selected;
  dispatcher.call('state-changed', this, state);
});
dispatcher.on('zoom-control-changed.state', data => {
  state.zoom = data.selected;
  dispatcher.call('state-changed', this, state);
});*/

// Asynchronous
// TODO: reduce the amount of code - put the dispatcher in the loadData
// function?
loadData()
  .then(data => {
    // Publish the data with the "data-loaded" event
    dispatcher.call('data-loaded', this, data);
  })
  .catch(error => {
    /* TODO: decide what to do if the init has failed.
     * Meanwhile, it prints the error in the console. */
    console.log(error);
  });

// Create the layout
dispatcher.on('state-changed.search', newState => {
  makeSearch(select('section#search'), dispatcher, newState);
});

dispatcher.on('state-changed.map', newState => {
  makeMap(select('section#map'), dispatcher, newState);
});
