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

import { UiRedirectComponent } from '../../ui-redirect/ui-redirect.component';
import { UiTagComponent } from '../../ui-tag/ui-tag.component';
import { VideosDataService } from '@frontend/video';
import {
  VideoApiResponseModel
} from '@frontend/video-data';

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
  public isYoutubeUrl: boolean = false;
  public embeddedUrl: SafeResourceUrl = '';

  public showTournamentDetails: boolean = false;
  public showTeamOneDetails: boolean = false;
  public showTeamTwoDetails: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private videosDataService: VideosDataService,
    private sanitizer: DomSanitizer
  ) {
    const videoId = Number(this.route.snapshot.paramMap.get('id'));
    this.video = this.videosDataService.getVideoById(videoId);
    this.isYoutubeUrl = this.getIsYoutubeUrl(this.video?.videoLink ?? '');
    if (this.isYoutubeUrl) {
      this.embeddedUrl = this.getEmbeddedUrl(this.video?.videoLink ?? '');
    }
  }

  public getIsYoutubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  }

  public getEmbeddedUrl(url: string): SafeResourceUrl {
    const urlParts = url.split('/');
    const videoId = urlParts[urlParts.length - 1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
