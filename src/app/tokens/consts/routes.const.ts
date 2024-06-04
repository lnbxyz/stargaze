import { Routes } from '@angular/router';
import { HomeComponent } from '../../pages/home/home.component';
import { CompareComponent } from '../../pages/compare/compare.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'compare',
    component: CompareComponent,
  },
];
