/**
 * Tap Store.
 * Tell us what we can drink; we're not here to fuck spiders.
 */

import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';


// array of Tap objects -> Immutable Map
function tapsToMap(taps = []) {
  return new Immutable.Map().withMutations((map) => {
    taps.forEach(tap => map.set(tap.id, tap));
    return map;
  });
}


class TapsStore extends ReduceStore {
  getInitialState() {
    const sync = new Immutable.Map({
      fetching: false,
      fetched: false,
      error: null,
    });
    const taps = new Immutable.Map();
    return new Immutable.Map().mergeIn(['sync'], sync).mergeIn(['taps'], taps);
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {
      case 'REQUEST_FETCH_TAPS':
        return state.set('sync', new Immutable.Map({
          fetching: true,
          fetched: false,
          error: null,
        })).set('taps', new Immutable.Map());

      case 'RECEIVE_FETCH_TAPS':
        return state.set('sync', new Immutable.Map({
          fetching: false,
          fetched: true,
          error: error || null,
        })).set('taps', tapsToMap(data));

      case 'RECEIVE_RATE_KEG': {
        // todo - not sure how but sometimes .taps isn't set...?
        if (!state.has('taps')) return state;

        // a notification gets fired from the action creator
        // so we're good to ignore this
        if (error) return state;

        // payload is a Keg.
        // if that Keg is in our Taps, find it and update it.
        const matchingTap = state.get('taps').findEntry(tap => tap.kegId === action.kegId);
        if (matchingTap) {
          const [tapId, tapObject] = matchingTap;
          return state.setIn(['taps', tapId], {
            ...tapObject,
            Keg: data,
          });
        }
        return state;
      }

      default:
        return state;
    }
  }
}

// export a singleton, one is plenty
export default new TapsStore(dispatcher);
