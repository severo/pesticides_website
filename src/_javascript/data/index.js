import * as states from './states';
import * as statistics from './statistics';

export function loadData(dataCfg, dispatcher) {
  const dataPromises = [
    states.load(dataCfg.states.url),
    statistics.load(dataCfg.statistics.url),
  ];
  return Promise.all(dataPromises).then(result => {
    const data = {
      states: result[0],
      statistics: result[1],
    };
    dispatcher.call('load', this, data);
    return data;
  });
}
