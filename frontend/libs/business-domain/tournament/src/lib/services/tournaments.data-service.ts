import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  TournamentApiResponseModel,
  TournamentsApiClient,
} from '@frontend/tournament-data';

@Injectable({ providedIn: 'root' })
export class TournamentsDataService {
  private readonly tournamentsApiClient: TournamentsApiClient =
    inject(TournamentsApiClient);

  public getTournaments(): Signal<TournamentApiResponseModel[]> {
    return toSignal(this.tournamentsApiClient.get(), { initialValue: [] });
  }
}
