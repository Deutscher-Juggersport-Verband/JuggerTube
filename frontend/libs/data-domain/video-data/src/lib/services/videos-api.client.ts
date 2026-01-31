import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VideoCategoriesEnum } from '../enums/video-categories.enum';
import {
  PaginatedVideosApiResponseModel,
  VideoApiResponseModel,
} from '../models/video-api-response.model';
import { CreateVideoRequestModel } from '../models/create-video-request.model';

export interface ChannelModel {
  id: number;
  name: string;
  link: string;
}

export interface CreateChannelRequest {
  name: string;
  link: string;
}

export type SortOption =
  | 'name_asc'
  | 'name_desc'
  | 'recording_date_asc'
  | 'recording_date_desc'
  | 'upload_date_desc'
  | 'created_at_desc';

export interface VideoFilterOptions {
  sort?: SortOption;
  nameFilter?: string;
  category?: VideoCategoriesEnum;
  channelName?: string;
  teamName?: string;
  tournamentName?: string;
  recordingDateFrom?: string;
  recordingDateTo?: string;
  uploadDateFrom?: string;
  uploadDateTo?: string;
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
    limit: number,
    filters?: VideoFilterOptions
  ): Observable<PaginatedVideosApiResponseModel> {
    let params = new HttpParams().set('start', start).set('limit', limit);

    if (filters) {
      if (filters.sort) {
        params = params.set('sort', filters.sort);
      }
      if (filters.nameFilter) {
        params = params.set('name_filter', filters.nameFilter);
      }
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      if (filters.channelName) {
        params = params.set('channel_name', filters.channelName);
      }
      if (filters.teamName) {
        params = params.set('team_name', filters.teamName);
      }
      if (filters.tournamentName) {
        params = params.set('tournament_name', filters.tournamentName);
      }
      if (filters.recordingDateFrom) {
        params = params.set('recording_date_from', filters.recordingDateFrom);
      }
      if (filters.recordingDateTo) {
        params = params.set('recording_date_to', filters.recordingDateTo);
      }
      if (filters.uploadDateFrom) {
        params = params.set('upload_date_from', filters.uploadDateFrom);
      }
      if (filters.uploadDateTo) {
        params = params.set('upload_date_to', filters.uploadDateTo);
      }
    }

    return this.httpClient.get<PaginatedVideosApiResponseModel>(
      '/api/video-frontend/get-paginated-videos',
      { params }
    );
  }

  public create(
    videoData: CreateVideoRequestModel
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
