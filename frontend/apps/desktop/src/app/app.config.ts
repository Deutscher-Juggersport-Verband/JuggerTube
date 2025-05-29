import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { appRoutes } from './app.routes';
import { GetUserDetailsDataEffect } from '@frontend/user';
import { JwtInterceptor } from '@frontend/user-data';
import {
  CreateVideoEffects,
  LoadNextVideosEffects,
  LoadPaginatedVideosEffects,
  metaReducers,
  reducers,
} from '@frontend/video';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideStore(reducers, { metaReducers }),
    provideEffects([
      LoadPaginatedVideosEffects,
      LoadNextVideosEffects,
      GetUserDetailsDataEffect,
    ]),
    provideEffects([
      LoadPaginatedVideosEffects,
      LoadNextVideosEffects,
      CreateVideoEffects,
    ]),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
};
