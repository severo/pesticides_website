import {appendContent} from './content';
import {appendControls} from './controls';
import {appendDebug} from './debug';
import {dispatch} from 'd3-dispatch';
import {loadData} from './data';
import {select} from 'd3-selection';

// TODO: cfg
const dispatcher = dispatch(
  'data-loaded',
  'number-hover',
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
  dispatcher.call('state-changed', this, state);
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
// TODO: in cfg
const appDom = select('section#app');
const controlsDom = select('div#controls');
appendControls(dispatcher, controlsDom, state);
appendContent(dispatcher, appDom);
appendDebug(dispatcher, controlsDom);
