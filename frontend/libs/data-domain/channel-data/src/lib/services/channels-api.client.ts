import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ChannelApiResponseModel } from '../models/channel-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelsApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public get(): Observable<ChannelApiResponseModel[]> {
    return this.httpClient.get<ChannelApiResponseModel[]>(
      '/api/channel-frontend/get-channel-overview'
    );
  }
}
