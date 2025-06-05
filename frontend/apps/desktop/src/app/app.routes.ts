import { Route } from '@angular/router';

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
      },
      {
        path: 'pending-video-overview',
        component: PagePendingVideoOverviewComponent,
      },
      {
        path: 'user-details',
        component: PageUserDetailsComponent,
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
      },
      {
        path: 'login',
        component: PageLoginComponent,
      },
      {
        path: '**',
        redirectTo: 'video-overview',
      },
    ],
  },
];
