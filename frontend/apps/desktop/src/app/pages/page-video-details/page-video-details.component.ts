import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
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

@Component({
  imports: [CommonModule, UiRedirectComponent, RouterLink, UiTagComponent],
  standalone: true,
  templateUrl: './page-video-details.component.html',
  styleUrl: './page-video-details.component.less',
  animations: [
    trigger('slideDown', [
      state('hidden', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('visible', style({ height: '*', overflow: 'hidden', opacity: 1 })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class PageVideoDetailsComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly videosDataService: VideosDataService =
    inject(VideosDataService);

  public video: VideoApiResponseModel | undefined =
    this.videosDataService.getVideoById(
      Number(this.route.snapshot.paramMap.get('id'))
    );
  public isYoutubeUrl = isYoutubeUrl(this.video?.videoLink ?? '');
  public embeddedUrl: SafeResourceUrl | null = getEmbeddedUrlRule(
    this.video?.videoLink ?? ''
  );

  public showTournamentDetails = false;
  public showTeamOneDetails = false;
  public showTeamTwoDetails = false;
}
