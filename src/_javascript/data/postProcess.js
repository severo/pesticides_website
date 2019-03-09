import {feature, merge} from 'topojson';

export function postProcess(raw) {
  const data = {
    geojson: {
      brazil: merge(raw.states, raw.states.objects.estados.geometries),
      states: feature(raw.states, raw.states.objects.estados),
    },
  };
  return data;
}
