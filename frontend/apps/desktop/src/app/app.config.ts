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
import { ChangeUserDetailsEffect, ChangeUserRoleEffect, DeleteUserEffect, GetUserDetailsDataEffect, GetUserRoleEffect, LoginUserEffect, RegisterUserEffect, UpdateUserProfilePictureEffect } from '@frontend/user';
import { JwtInterceptor } from '@frontend/user-data';
import {
  CreateVideoEffects,
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
      ChangeUserDetailsEffect,
      ChangeUserRoleEffect,
      DeleteUserEffect,
      GetUserDetailsDataEffect,
      GetUserRoleEffect,
      LoginUserEffect,
      RegisterUserEffect,
      UpdateUserProfilePictureEffect,
      CreateVideoEffects
    ]),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
};
