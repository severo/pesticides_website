import {
  appendDataControl,
  initControl as initDataControl,
} from './dataControl.js';
import {
  appendZoomControl,
  initControl as initZoomControl,
} from './zoomControl.js';

export function appendControls(dispatcher, parent) {
  // TODO: in cfg
  const controlsId = 'controls';
  const controls = parent.append('div').attr('id', controlsId);
  appendZoomControl(dispatcher, controls);
  appendDataControl(dispatcher, controls);

  return controls;
}
export function initControls() {
  initZoomControl();
  initDataControl();
}
