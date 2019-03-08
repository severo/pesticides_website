import * as d3 from 'd3-dispatch';
import {cfg} from './cfg';
import {init} from './init';

const dispatcher = d3.dispatch('load');

const state = {};
dispatcher.on('load.state', data => {
  state.data = data;
  console.log('Data has been loaded:');
  console.log(data);
});

/* Asynchronous */
init(cfg, dispatcher).catch(error => {
  /* TODO: decide what to do if the init has failed.
   * Meanwhile, it prints the error in the console. */
  console.log(error);
});
