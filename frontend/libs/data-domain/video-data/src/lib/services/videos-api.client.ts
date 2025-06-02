import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GameSystemTypesEnum } from '../enums/game-system-types.enum';
import { VideoCategoriesEnum } from '../enums/video-categories.enum';
import { WeaponTypesEnum } from '../enums/weapon-types.enum';
import {
  PaginatedVideosApiResponseModel,
  VideoApiResponseModel,
} from '../models/video-api-response.model';

export interface ChannelModel {
  id: number;
  name: string;
  link: string;
}

export interface CreateChannelRequest {
  name: string;
  link: string;
}

export interface CreateVideoRequest {
  name: string;
  videoLink: string;
  channelLink: string;
  category: VideoCategoriesEnum;
  uploadDate: string;
  dateOfRecording: string;
  topic?: string;
  guests?: string;
  weaponType?: WeaponTypesEnum;
  gameSystem?: GameSystemTypesEnum;
  tournament?: {
    id?: number;
    name?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
  };
  teamOne?: {
    id?: number;
    name?: string;
    city?: string;
  };
  teamTwo?: {
    id?: number;
    name?: string;
    city?: string;
  };
  comment?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideosApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public get(): Observable<VideoApiResponseModel[]> {
    return this.httpClient.get<VideoApiResponseModel[]>(
      '/api/video-frontend/get-video-overview'
    );
  }

  public getPaginatedVideos$(
    start: number,
    limit: number
  ): Observable<PaginatedVideosApiResponseModel> {
    const params = new HttpParams().set('start', start).set('limit', limit);
    return this.httpClient.get<PaginatedVideosApiResponseModel>(
      '/api/video-frontend/get-paginated-videos',
      { params }
    );
  }

  public create(
    videoData: CreateVideoRequest
  ): Observable<{ id: number; message: string }> {
    return this.httpClient
      .post<{ id: number; message: string }>(
        '/api/video-frontend/create-video',
        videoData
      )
      .pipe(
        catchError((error) => {
          console.error('Error creating video:', error);
          return throwError(() => error);
        })
      );
  }

  public getChannels(): Observable<ChannelModel[]> {
    return this.httpClient
      .get<ChannelModel[]>('/api/channel-frontend/get-channels')
      .pipe(
        catchError((error) => {
          console.error('Error fetching channels:', error);
          return throwError(() => error);
        })
      );
  }

  public createChannel(
    channelData: CreateChannelRequest
  ): Observable<ChannelModel> {
    return this.httpClient
      .post<ChannelModel>('/api/channel-frontend/create-channel', channelData)
      .pipe(
        catchError((error) => {
          console.error('Error creating channel:', error);
          return throwError(() => error);
        })
      );
  }
}
