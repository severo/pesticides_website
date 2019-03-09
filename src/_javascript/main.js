import {cfg} from './cfg';
import {dispatch} from 'd3-dispatch';
import {loadData} from './data';

const dispatcher = dispatch('load');

/* Should be useless... We will see */
const state = {};
dispatcher.on('load.state', data => {
  state.data = data;
  console.log('Data has been loaded');
  //console.log(data);
});

/* Asynchronous */
loadData(cfg.datasets, dispatcher).catch(error => {
  /* TODO: decide what to do if the init has failed.
   * Meanwhile, it prints the error in the console. */
  console.log(error);
});
