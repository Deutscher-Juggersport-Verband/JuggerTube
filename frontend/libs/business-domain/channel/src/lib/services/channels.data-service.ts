import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  ChannelApiResponseModel,
  ChannelsApiClient,
} from '@frontend/channel-data';

@Injectable({ providedIn: 'root' })
export class ChannelsDataService {
  constructor(private readonly channelsApiClient: ChannelsApiClient) {}

  public getChannels(): Signal<ChannelApiResponseModel[] | undefined> {
    return toSignal(this.channelsApiClient.get());
  }
}
