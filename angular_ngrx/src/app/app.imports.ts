import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { EffectsModule } from '@ngrx/effects';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { useLogMonitor } from '@ngrx/store-log-monitor';

import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { routes } from './app.routes';
import { rootReducer } from './reducers';
import { StoreDevToolsModule } from './features/store-devtools.module';
// import { UserEffects } from './user/user.effects';

const STORE_DEV_TOOLS_IMPORTS = [];
if (ENV === 'development' && !AOT &&
  ['monitor', 'both'].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
) STORE_DEV_TOOLS_IMPORTS.push(...[
  StoreDevtoolsModule.instrumentStore({
    monitor: useLogMonitor({
      visible: true,
      position: 'right'
    })
  })
]);

export const APP_IMPORTS = [
  // EffectsModule.run(UserEffects),
  ReactiveFormsModule,
  RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules }),
  RouterStoreModule.connectRouter(),
  StoreModule.provideStore(rootReducer),
  STORE_DEV_TOOLS_IMPORTS,
  StoreDevToolsModule,
  TransferHttpModule,
  BrowserAnimationsModule,
  ChartModule.forRoot(highcharts)
];
