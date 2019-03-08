import {cfg} from './cfg.js';
import {csv} from 'd3-fetch';

const loadData = csv(cfg.dataUrl);

export {loadData};
