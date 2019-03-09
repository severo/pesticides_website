import {createBigMap} from './map';
import {dispatch} from 'd3-dispatch';
import {loadData} from './data';

const dispatcher = dispatch('load');

// Should be useless... We will see
const state = {};
dispatcher.on('load.state', data => {
  state.data = data;
  console.log('Data has been loaded');
});

// Asynchronous
loadData()
  .then(data => {
    // Publish the data with the "load" event
    dispatcher.call('load', this, data);
    // Should we return a value?
  })
  .catch(error => {
    /* TODO: decide what to do if the init has failed.
     * Meanwhile, it prints the error in the console. */
    console.log(error);
  });

// Create the map when data has loaded
dispatcher.on('load.map', data => {
  createBigMap(data);
});
