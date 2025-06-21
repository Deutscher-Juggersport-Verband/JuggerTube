import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TeamApiResponseModel } from '../models/team-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public get(): Observable<TeamApiResponseModel[]> {
    return this.httpClient.get<TeamApiResponseModel[]>(
      '/api/team-frontend/get-team-overview'
    );
  }
}
