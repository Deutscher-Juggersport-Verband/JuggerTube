import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TeamApiResponseModel, TeamsApiClient } from '@frontend/team-data';

@Injectable({ providedIn: 'root' })
export class TeamsDataService {
  private readonly teamsApiClient: TeamsApiClient = inject(TeamsApiClient);

  public getTeams(): Signal<TeamApiResponseModel[]> {
    return toSignal(this.teamsApiClient.get(), { initialValue: [] });
  }
}
