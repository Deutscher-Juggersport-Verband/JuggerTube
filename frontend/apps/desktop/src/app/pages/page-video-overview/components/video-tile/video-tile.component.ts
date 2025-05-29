import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { UiTagComponent } from '../../../../shared/ui-shared';
import { VideoApiResponseModel } from '@frontend/video-data';

@Component({
  selector: 'video-tile',
  imports: [CommonModule, UiTagComponent],
  standalone: true,
  templateUrl: './video-tile.component.html',
  styleUrl: './video-tile.component.less',
})
export class VideoTileComponent {
  @Input() public video!: VideoApiResponseModel;
}
