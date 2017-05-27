import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class HomeActions {

  static TEST = '[Home] Test action';
  testAction(flag: boolean) {
    return {
      type: HomeActions.TEST,
      payload: flag,
    };
  }

  static ADD_UNIT = '[Home] Add unit';
  addUnitAction(unit: any) {
    return {
      type: HomeActions.ADD_UNIT,
      payload: unit
    };
  }

  static REMOVE_UNIT = '[Home] Remove unit';
  removeUnitAction(unit: any) {
    return {
      type: HomeActions.REMOVE_UNIT,
      payload: unit
    }
  }

}
