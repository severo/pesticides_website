import * as brazil from './brazil';

const cfg = {
  id: 'content',
};

const create = {
  brazil: {
    concentration: brazil.create,
    number: brazil.create,
  },
  saopaolo: {
    concentration: state => {},
    number: state => {},
  },
};

export function appendContent(dispatcher, parent) {
  const content = parent.append('div').attr('id', cfg.id);

  startLoading(content);

  dispatcher.on('state-changed.content', state => {
    startLoading(content);
    create[state.zoom][state.view](state, content);
    endLoading(content);
  });

  return content;
}
export function initContent() {}

function startLoading(content) {
  content.classed('is-loading', true);
}
function endLoading(content) {
  content.classed('is-loading', false);
}
