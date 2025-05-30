import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TeamApiResponseModel } from '../models/team-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsApiClient {
  constructor(private httpClient: HttpClient) {}

  public get(): Observable<TeamApiResponseModel[]> {
    return this.httpClient.get<TeamApiResponseModel[]>(
      '/api/team-frontend/get-team-overview'
    );
  }
}
