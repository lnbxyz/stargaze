import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './tokens/consts/routes.const';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
  ],
};
