import { Action } from '@ngrx/store';

import { HomeActions } from './home.actions';

export interface HomeState {
  units: Array<any>;
  test: boolean;
}

export const initialState: HomeState = {
  units: [],
  test: false,
}

export function homeReducer(state = initialState, action: Action): HomeState {
  switch (action.type) {

    case HomeActions.ADD_UNIT: {
      return Object.assign({}, state, {
        units: [...state.units, action.payload]
      });
    }

    case HomeActions.REMOVE_UNIT: {
      return Object.assign({}, state, {
        units: state.units.filter(el => el.id !== action.payload.id)
      });
    };

    case HomeActions.TEST: {
      return Object.assign({}, state, {
        test: action.payload
      });
    }

    default: {
      return state;
    }
  }
}
