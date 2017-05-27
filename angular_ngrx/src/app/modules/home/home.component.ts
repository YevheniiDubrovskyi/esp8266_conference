import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MdDialog, MdDialogRef } from '@angular/material';

import { AppState } from '../../reducers';

import { HomeService } from './home.service';
import { HomeActions } from './home.actions';

@Component({
  selector: 'dialog-add-unit',
  template: `
    <h1>test</h1>
  `,
  styles: [`

`]
})
export class DialogAddUnit {
  constructor(public dialogRef: MdDialogRef<DialogAddUnit>) { }
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styles: [`
.home {
  background: #fafafa;
  color: rgba(0,0,0,.87);
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 2px 2px rgba(0,0,0,.24), 0 0 2px rgba(0,0,0,.12);
  margin: 30px auto;
  font-family: Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;
}

.home-header {
  font-size: 30px;
  font-weight: 300;
  margin: 0;
  padding: 50px;
  text-transform: uppercase;
  color: #fff;
  background: #00bcd4;
}

.home-controls_list {
  list-style: none;
  display: flex;
  padding: 20px;
  margin: 0;
}

.home-controls_list-item {
  margin-right: 10px;
}

.home-units-header {
  text-align: center;
  margin: 10px 0;
}

.home-units-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 20px;
  justify-content: space-around
}

.home-units-list-item {
  width: 30%;
}
  `]
})
export class HomeComponent implements OnDestroy, OnInit {
  destroyed$: Subject<any> = new Subject<any>();
  test$: Observable<boolean>;
  test: boolean;

  units$: Observable<Array<any>>;
  units: Array<any>;

  options_1: any;

  constructor(
    private store: Store<AppState>,
    private homeService: HomeService,
    private homeActions: HomeActions,
    private dialog: MdDialog,
  ) {
    this.options_1 = {
      series: [
        {
          data: [29.9, 71.5, 106.4, 129.2]
        }
      ]
    };

    this.test$ = this.store.select('home', 'test');
    this.units$ = this.store.select('home', 'units');

    this.units$.takeUntil(this.destroyed$)
      .subscribe(units => this.units = units);
    this.test$.takeUntil(this.destroyed$)
      .subscribe(testFlag => this.test = testFlag);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyed$.next();
  }

  onTestButtonClick(event) {
    event.preventDefault();

    this.store.dispatch(
      this.homeActions.testAction(!this.test)
    );
  }

  onAddButtonClick(event) {
    this.dialog.open(DialogAddUnit)
      .afterClosed()
      .subscribe(result => {
        console.log('Result', result);
      });
  }

}
