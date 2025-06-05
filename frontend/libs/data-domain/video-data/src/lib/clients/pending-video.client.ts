import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';

import { PendingVideo } from '../models/pending-video.model';
import { VideoStatus } from '../models/video-status.model';

@Injectable({
  providedIn: 'root',
})
export class PendingVideoClient {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly pendingVideoOverviewCache$ = new BehaviorSubject<
    PendingVideo[]
  >([]);

  public getPendingVideoOverview$(): Observable<PendingVideo[]> {
    if (this.pendingVideoOverviewCache$.value.length === 0) {
      this.http
        .get<PendingVideo[]>('/api/video-frontend/get-pending-video-overview')
        .subscribe((data) => this.pendingVideoOverviewCache$.next(data));
    }
    return this.pendingVideoOverviewCache$.asObservable();
  }

  public invalidatePendingVideoOverviewCache(): void {
    this.pendingVideoOverviewCache$.next([]);
  }

  public removePendingVideoFromCache(videoId: number): void {
    const currentVideos = this.pendingVideoOverviewCache$.value;
    const updatedVideos = currentVideos.filter((video) => video.id !== videoId);
    this.pendingVideoOverviewCache$.next(updatedVideos);
  }

  public async updateVideoStatus$(
    videoId: number,
    status: VideoStatus
  ): Promise<Response> {
    return await firstValueFrom(
      this.http
        .put<Response>('/api/video-frontend/update-pending-video-status', {
          videoId,
          status,
        })
        .pipe(
          tap(() => {
            if (status !== VideoStatus.PENDING) {
              this.removePendingVideoFromCache(videoId);
            }
          })
        )
    );
  }
}
