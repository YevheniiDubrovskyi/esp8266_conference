/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './modules/home#HomeModule'
  },
  {
    path: 'unit/:id',
    loadChildren: './modules/unit#UnitModule'
  },
  {
    path: '**',
    component: NotFound404Component
  }
];
