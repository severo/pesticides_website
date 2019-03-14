import * as viewControl from './viewControl.js';
import * as zoomControl from './zoomControl.js';

export function appendControls(dispatcher, parent) {
  // TODO: in cfg
  const controlsId = 'controls';
  const controls = parent.append('div').attr('id', controlsId);
  viewControl.append(dispatcher, controls);
  zoomControl.append(dispatcher, controls);

  return controls;
}
