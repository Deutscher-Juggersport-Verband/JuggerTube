import { Component, inject } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { UiRedirectComponent, UiTagComponent } from '../../ui-shared';
import {
  getEmbeddedUrlRule,
  isYoutubeUrl,
  VideosDataService,
} from '@frontend/video';
import { VideoApiResponseModel } from '@frontend/video-data';
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
  private readonly videosDataService: VideosDataService =
    inject(VideosDataService);

  public video: VideoApiResponseModel | undefined =
    this.videosDataService.getVideoById(
      Number(this.route.snapshot.paramMap.get('id')),
    );
  public isYoutubeUrl = isYoutubeUrl(this.video?.videoLink ?? '');
  public embeddedUrl: SafeResourceUrl | null = getEmbeddedUrlRule(
    this.video?.videoLink ?? '',
  );
}
