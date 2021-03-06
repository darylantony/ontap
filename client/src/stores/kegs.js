/**
 * Kegs Store.
 * A store for the Keg List view.
 */

import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';


// array of keg objects -> Immutable Map
function kegsToMap(kegs = []) {
  return new Immutable.Map().withMutations((map) => {
    kegs.forEach((keg) => {
      map.set(keg.id, keg);
    });
    return map;
  });
}

class KegMapStore extends ReduceStore {

  getInitialState() {
    const sync = new Immutable.Map({
      fetching: false,
      fetched: false,
      error: null,
    });
    const kegs = new Immutable.Map();
    return new Immutable.Map().mergeIn(['sync'], sync).mergeIn(['kegs'], kegs);
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      // fetch all kegs
      case 'REQUEST_FETCH_KEGS':
        return state.set('sync', new Immutable.Map({
          fetching: true,
          fetched: false,
          error: null,
        })).set('kegs', new Immutable.Map());

      case 'RECEIVE_FETCH_KEGS':
        return state.set('sync', new Immutable.Map({
          fetching: false,
          fetched: true,
          error: error || null,
        })).set('kegs', kegsToMap(data));

      case 'RECEIVE_RATE_KEG':
        // todo - handle this.
        if (error) return state;

        // payload is a Keg.
        // if it's in the store, update it.
        // todo - what if it's not? ignore it?
        if (state.hasIn(['kegs', action.kegId])) {
          return state.setIn(['kegs', action.kegId], data);
        }
        return state;

      default:
        return state;
    }
  }

}

export default new KegMapStore(dispatcher);
