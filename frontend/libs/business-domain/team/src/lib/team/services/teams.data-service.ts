import { Injectable, Signal } from '@angular/core';

import {toSignal} from "@angular/core/rxjs-interop";
import {TeamApiResponseModel, TeamsApiClient} from "@frontend/team-data";

@Injectable({ providedIn: 'root' })
export class TeamsDataService {
  constructor(private readonly teamsApiClient: TeamsApiClient) {}

  public getTeams(): Signal<TeamApiResponseModel[] | undefined> {
    return toSignal(this.teamsApiClient.get());
  }
}
