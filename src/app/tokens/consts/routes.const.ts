import { Routes } from '@angular/router';
import { HomePageComponent } from '../../pages/home/home.component';
import { ResultPageComponent } from '../../pages/result/result.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'result',
    component: ResultPageComponent,
  },
];
