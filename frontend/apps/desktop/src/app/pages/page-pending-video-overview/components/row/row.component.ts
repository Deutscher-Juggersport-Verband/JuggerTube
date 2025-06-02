import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  UiButtonColorEnum,
  UiButtonComponent,
  UiButtonTypeEnum,
  UiTagComponent,
} from '../../../../ui-shared';
import { getEmbeddedUrlRule, isYoutubeUrl } from '@frontend/video';
import {
  PendingVideo,
  PendingVideoClient,
  VideoStatus,
} from '@frontend/video-data';

@Component({
  selector: 'row',
  imports: [CommonModule, UiTagComponent, UiButtonComponent, RouterLink],
  standalone: true,
  templateUrl: './row.component.html',
  styleUrl: './row.component.less',
})
export class RowComponent {
  private readonly pendingVideoClient: PendingVideoClient =
    inject(PendingVideoClient);

  @Input() public video!: PendingVideo;
  @Input() public isTileVisible: boolean = false;
  @Output() public tileToggle = new EventEmitter<number>();

  protected readonly isYoutubeUrl = isYoutubeUrl;
  protected readonly getEmbeddedUrlRule = getEmbeddedUrlRule;
  protected readonly UiButtonTypeEnum = UiButtonTypeEnum;
  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly VideoStatus = VideoStatus;

  public toggleTile(): void {
    this.tileToggle.emit(this.video.id);
  }

  public updateVideoStatus(status: VideoStatus): void {
    this.pendingVideoClient.updateVideoStatus$(this.video.id, status);
  }
}
