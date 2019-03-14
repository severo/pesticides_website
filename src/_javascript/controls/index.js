import * as viewControl from './viewControl.js';
import * as zoomControl from './zoomControl.js';

export function appendControls(dispatcher, parent, defaultState) {
  // TODO: in cfg
  const controlsId = 'controls';
  const controls = parent.append('div').attr('id', controlsId);
  viewControl.append(dispatcher, controls, defaultState);
  zoomControl.append(dispatcher, controls, defaultState);

  return controls;
}
