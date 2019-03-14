import {appendControls, initControls} from './controls';
import {appendContent} from './content';
//import {createBigMap} from './map';
import {dispatch} from 'd3-dispatch';
import {loadData} from './data';
import {select} from 'd3-selection';

// TODO: cfg
const dispatcher = dispatch(
  'data-loaded',
  'state-changed',
  'view-changed',
  'view-control-changed',
  'zoom-control-changed'
);

const state = {
  data: {},
  view: 'number',
  zoom: 'brazil',
};
dispatcher.on('data-loaded.state', data => {
  state.data = data;
  console.log('Data has been loaded');
  dispatcher.call('state-changed', this, data);
});
dispatcher.on('view-control-changed.state', data => {
  state.view = data.selected;
  dispatcher.call('state-changed', this, state);
});
dispatcher.on('zoom-control-changed.state', data => {
  state.zoom = data.selected;
  dispatcher.call('state-changed', this, state);
});

// Asynchronous
loadData()
  .then(data => {
    // Publish the data with the "data-loaded" event
    dispatcher.call('data-loaded', this, data);
    // Should we return a value?
  })
  .catch(error => {
    /* TODO: decide what to do if the init has failed.
     * Meanwhile, it prints the error in the console. */
    console.log(error);
  });

// Create the layout
createLayout();

// register the data-control-changed callback
/*dispatcher.on('data-control-changed', data => {
  console.log(data.selected);
});*/

// Create the map when data has loaded
// TODO: create the basis before the data has loaded (with a "loading..."
// notification)
dispatcher.on('data-loaded.app', data => {
  showDefaultView();
  //createBigMap(data);
});

function createLayout() {
  // TODO: in cfg
  // Setup the controls
  const appId = 'app';
  const appDiv = select('div#' + appId);
  appendControls(dispatcher, appDiv);
  appendContent(dispatcher, appDiv);

  return appDiv;
}

function showDefaultView() {
  // TODO: change the logic, maybe use promises, in order to ensure the elements
  // are created in the correct order, and avoid errors (ie: append an element
  // to an unexisting parent)
  // Init the controls (click on the "brazil" and "number" options)
  initControls();
}
