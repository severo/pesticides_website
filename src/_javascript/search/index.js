import {select, selectAll} from 'd3-selection';
import {deburr} from 'lodash-es';

const limit = 5;

export function makeSearch(parent, dispatcher, state) {
  startLoading(parent);

  // TODO: add unit tests to verify that the cities are ordered as expected for
  // some queries ('sa', 'sao p', etc.)
  function scorer(query, choice, options) {
    // All scores are between 0 (worst) and 100 (best)
    // Get a score based on the distance of Levinstein - see
    // https://github.com/nol13/fuzzball.js
    // There are other functions in fuzzball.js, but that one seems to give the
    // best results (from a point of view of a user), and to run faster
    const fuzzScore = fuzz.ratio(query, choice.name, options);
    // Weight by the population, in order to increase the visibility of big
    // cities
    const popScore = choice.popScore;
    // Increase the relative weight of the population when the query string is
    // short
    // eslint-disable-next-line no-magic-numbers
    const popProp = 2 / (1 + query.length);
    const fuzzProp = 1 - popProp;
    return fuzzProp * fuzzScore + popProp * popScore;
  }
  const fuzz = window.fuzzball;
  const choices = (function() {
    // TODO: we could compute these two values, but it would take some time, and
    // the result should be the same (maybe set a unit test)
    const minPop = 812;
    const maxPop = 12106920;
    const popFactor = 100;
    const logMinPop = Math.log10(minPop);
    const logMaxPop = Math.log10(maxPop);
    const div = popFactor / (logMaxPop - logMinPop);
    return state.data.mun.features.map(ft => {
      return {
        mun: ft,
        name: ft.properties.deburredName,
        popScore: (Math.log10(ft.properties.population) - logMinPop) * div,
      };
    });
  })();
  const options = {
    cutoff: 50, // lowest score to return, default: 0
    limit: limit, // max number of top results to return, default: no limit / 0.
    //processor: processor, //takes choice object, returns string, default: no processor. Must supply if choices are not already strings.
    scorer: scorer, // any function that takes two values and returns a score, default: ratio
    unsorted: false, // results won't be sorted if true, default: false. If true limit will be ignored.
  };
  // TODO: see if we preprocess something

  select('#search-input').on('focus', (aa, bb, cc) => {
    // Init: list of results for an empty value
    dispatcher.call(
      'search-results-updated',
      null,
      // Maybe use Intl.Collator instead
      // https://github.com/nol13/fuzzball.js#collation-and-unicode-stuff
      // But I think it will not change anything in the result, and make it
      // slower
      fuzz.extract('', choices, options)
    );
    showModal();
  });

  select('#search-modal .modal-background').on('click', (aa, bb, cc) => {
    hideModal();
  });
  select('#search-modal .modal-close').on('click', (aa, bb, cc) => {
    hideModal();
  });
  dispatcher.on('search-selected.search', mun => {
    hideModal();
  });

  select('#search-modal-input').on('keydown', (aa, bb, cc) => {
    // Check for up/down key presses
    if (event.code === 'ArrowDown') {
      // Avoid scrolling the screen behind the modal
      event.preventDefault();

      const results = selectAll('#search #results li a');
      if (!results.empty()) {
        // Selects the first result in the list
        results.node().focus();
      }
    }
  });

  select('#search-modal-input').on('input', (aa, bb, cc) => {
    // TODO: launch promises, and cancel any previous running promise
    const text = cc[0].value;
    dispatcher.call(
      'search-results-updated',
      null,
      // Maybe use Intl.Collator instead
      // https://github.com/nol13/fuzzball.js#collation-and-unicode-stuff
      // But I think it will not change anything in the result, and make it
      // slower
      fuzz.extract(deburr(text), choices, options)
    );
  });

  dispatcher.on('search-results-updated.search', fuseResults => {
    updateResults(fuseResults, dispatcher);
  });

  endLoading(parent);
}

function showModal() {
  select('#search-modal').classed('is-active', true);
  select('#search-modal-input')
    .node()
    .focus();
}

function hideModal() {
  select('#search-modal').classed('is-active', false);
  select('#search-input').property('value', '');
  cleanModal();
}

function cleanModal() {
  select('#search-modal-input').property('value', '');
  emptyResults();
}

function emptyResults() {
  select('#search #results').html('');
}
function updateResults(fuseResults, dispatcher) {
  // TODO: style the list, see main search in https://www.tripadvisor.co.uk/
  const results = select('#search #results')
    .html('')
    .selectAll('li')
    .data(fuseResults.slice(0, limit))
    .enter()
    .append('li')
    .append('a')
    .attr('tabindex', 0);

  results.text(res => res[0].mun.properties.name);
  results.append('p').text(res => res[0].mun.properties.fuName);

  results.on('click', (result, idx) => {
    // TODO: react to other events? see accessibility
    // invoke callbacks
    emptyResults();
    dispatcher.call('search-selected', null, result[0].mun);
  });

  results.on('keydown', (result, idx, nodes) => {
    // Check for up/down key presses
    if (event.code === 'ArrowDown') {
      // Avoid scrolling the screen behind the modal
      event.preventDefault();

      // Selects the next result in the list
      if (idx < nodes.length - 1) {
        nodes[idx + 1].focus();
      }
      // Or do nothing if it's the last item
    } else if (event.code === 'ArrowUp') {
      // Avoid scrolling the screen behind the modal
      event.preventDefault();

      // Selects the previous result in the list
      if (idx > 0) {
        nodes[idx - 1].focus();
      } else {
        // Or focus the search input if the current item is the first in the
        // list
        select('#search-modal-input')
          .node()
          .focus();
      }
    } else if (event.code === 'NumpadEnter' || event.code === 'Enter') {
      emptyResults();
      dispatcher.call('search-selected', null, result[0].mun);
    } else if (event.code === 'Escape') {
      emptyResults();
      hideModal();
    }
  });
}

function startLoading(element) {
  element.classed('is-loading', true);
}
function endLoading(element) {
  element.classed('is-loading', false);
}
