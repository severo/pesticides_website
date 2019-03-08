import {loadData} from './data';

export function init(cfg, dispatcher) {
  return loadData(cfg.data, dispatcher);
}
