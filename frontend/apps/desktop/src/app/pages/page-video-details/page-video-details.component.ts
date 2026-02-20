import { Component, inject } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { UiRedirectComponent, UiTagComponent } from '../../ui-shared';
import {
  getEmbeddedUrlRule,
  isYoutubeUrl,
  VideosDataService,
} from '@frontend/video';
import { VideoApiResponseModel, VideosApiClient } from '@frontend/video-data';
import { userDetailsSelector } from '@frontend/user';
import { UserRoleEnum } from '@frontend/user-data';
import { DetailsToggleComponent } from './components/details-toggle/details-toggle.component';
import { DatePipe } from '@angular/common';

@Component({
  imports: [
    UiRedirectComponent,
    RouterLink,
    UiTagComponent,
    DetailsToggleComponent,
    DatePipe,
  ],
  templateUrl: './page-video-details.component.html',
  styleUrl: './page-video-details.component.less',
})
export class PageVideoDetailsComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly store: Store = inject(Store);
  private readonly videosDataService: VideosDataService =
    inject(VideosDataService);
  private readonly videosApiClient: VideosApiClient = inject(VideosApiClient);

  public video: VideoApiResponseModel | undefined =
    this.videosDataService.getVideoById(
      Number(this.route.snapshot.paramMap.get('id')),
    );
  public isYoutubeUrl = isYoutubeUrl(this.video?.videoLink ?? '');
  public embeddedUrl: SafeResourceUrl | null = getEmbeddedUrlRule(
    this.video?.videoLink ?? '',
  );

  protected readonly user = toSignal(this.store.select(userDetailsSelector));
  protected readonly UserRoleEnum = UserRoleEnum;

  public onDeleteVideo(): void {
    if (!this.video) return;
    this.videosApiClient.delete(this.video.id).subscribe(() => {
      this.router.navigate(['/video-overview']);
    });
  }
}
