import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { isYoutubeUrl, VideosDataService } from '@frontend/video';
import { VideoApiResponseModel } from '@frontend/video-data';
import { UiRedirectComponent } from '../../shared/ui-redirect/ui-redirect.component';
import { UiTagComponent } from '../../shared/ui-tag/ui-tag.component';
import { VideosDataService } from '@frontend/video';
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
  public video: VideoApiResponseModel | undefined = undefined;
  public isYoutubeUrl = false;
  public embeddedUrl: SafeResourceUrl = '';

  public showTournamentDetails = false;
  public showTeamOneDetails = false;
  public showTeamTwoDetails = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly videosDataService: VideosDataService,
    private readonly sanitizer: DomSanitizer
  ) {
    const videoId = Number(this.route.snapshot.paramMap.get('id'));
    this.video = this.videosDataService.getVideoById(videoId);
    this.isYoutubeUrl = isYoutubeUrl(this.video?.videoLink ?? '');
    if (this.isYoutubeUrl) {
      this.embeddedUrl = this.getEmbeddedUrl(this.video?.videoLink ?? '');
    }
  }

  public getEmbeddedUrl(url: string): SafeResourceUrl {
    const urlParts = url.split('/');
    const videoId = urlParts[urlParts.length - 1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
