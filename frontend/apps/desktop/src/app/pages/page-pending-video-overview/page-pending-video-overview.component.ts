import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { RowComponent } from './components/row/row.component';
import { SingletonGetter } from '@frontend/cache';
import { PendingVideo, PendingVideoClient } from '@frontend/video-data';

@Component({
  imports: [CommonModule, RowComponent],
  standalone: true,
  templateUrl: './page-pending-video-overview.component.html',
  styleUrl: './page-pending-video-overview.component.less',
})
export class PagePendingVideoOverviewComponent {
  private readonly pendingVideoClient: PendingVideoClient =
    inject(PendingVideoClient);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public openTileId: number | null = null;

  @SingletonGetter()
  public get pendingVideos$(): Observable<PendingVideo[]> {
    return this.pendingVideoClient.getPendingVideoOverview$();
  }

  public onTileToggle(videoId: number): void {
    this.openTileId = this.openTileId === videoId ? null : videoId;
    this.cdr.detectChanges();
  }
}
