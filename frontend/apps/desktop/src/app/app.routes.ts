import { Route } from '@angular/router';

import { GuestGuard } from './business-rules/guards/guest.guard';
import { PrivilegedGuard } from './business-rules/guards/privileged.guard';
import { UserGuard } from './business-rules/guards/user.guard';

import { PageCreateVideoComponent } from './pages/page-create-video/page-create-video.component';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PagePendingVideoOverviewComponent } from './pages/page-pending-video-overview/page-pending-video-overview.component';
import { PageRegisterComponent } from './pages/page-register/page-register.component';
import { PageUserDetailsComponent } from './pages/page-user-details/page-user-details.component';
import { PageVideoDetailsComponent } from './pages/page-video-details/page-video-details.component';
import { PageVideoOverviewComponent } from './pages/page-video-overview/page-video-overview.component';
import { UserDetailsResolver } from '@frontend/user';

export const appRoutes: Route[] = [
  {
    path: '',
    resolve: {
      userDetails: UserDetailsResolver,
    },
    children: [
      {
        path: 'video-overview',
        component: PageVideoOverviewComponent,
      },
      {
        path: 'video-details/:id',
        component: PageVideoDetailsComponent,
      },
      {
        path: 'create-video',
        component: PageCreateVideoComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'pending-video-overview',
        component: PagePendingVideoOverviewComponent,
        canActivate: [PrivilegedGuard],
      },
      {
        path: 'user-details',
        component: PageUserDetailsComponent,
        canActivate: [UserGuard],
      },
      /*{
        path: 'user-details/:escapedUsername?',
        component: PageUserDetailsComponent,
        resolve: {
          userDetails: UserDetailsResolver,
        },
      },*/
      {
        path: 'register',
        component: PageRegisterComponent,
        canActivate: [GuestGuard],
      },
      {
        path: 'login',
        component: PageLoginComponent,
        canActivate: [GuestGuard],
      },
      {
        path: '**',
        redirectTo: 'video-overview',
      },
    ],
  },
];
