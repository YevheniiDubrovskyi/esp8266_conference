import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  MdButtonModule,
  MdCardModule,
  MdDialogModule,
} from '@angular/material';

import { HomeComponent, DialogAddUnit } from './home.component';
import { routes } from './home.routes';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
  ],
  exports: [
    HomeComponent,
    DialogAddUnit,
  ],
  declarations: [
    HomeComponent,
    DialogAddUnit,
  ]
})
export class HomeModule { }
