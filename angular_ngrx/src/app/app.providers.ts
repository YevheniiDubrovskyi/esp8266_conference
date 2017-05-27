import { HomeService } from './modules/home/home.service';
import { HomeActions } from './modules/home/home.actions';

export const APP_PROVIDERS = [
  HomeService,
  HomeActions
];
