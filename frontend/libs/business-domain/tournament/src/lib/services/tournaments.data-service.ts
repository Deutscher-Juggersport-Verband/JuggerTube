import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  TournamentApiResponseModel,
  TournamentsApiClient,
} from '@frontend/tournament-data';

@Injectable({ providedIn: 'root' })
export class TournamentsDataService {
  constructor(private readonly tournamentsApiClient: TournamentsApiClient) {}

  public getTournaments(): Signal<TournamentApiResponseModel[] | undefined> {
    return toSignal(this.tournamentsApiClient.get());
  }
}
