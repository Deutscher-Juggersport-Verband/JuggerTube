import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TournamentApiResponseModel } from '../models/tournament-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class TournamentsApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  public get(): Observable<TournamentApiResponseModel[]> {
    return this.httpClient.get<TournamentApiResponseModel[]>(
      '/api/tournament-frontend/get-tournament-overview'
    );
  }
}
