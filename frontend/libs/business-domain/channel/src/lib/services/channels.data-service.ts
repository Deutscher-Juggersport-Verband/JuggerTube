import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  ChannelApiResponseModel,
  ChannelsApiClient,
} from '@frontend/channel-data';

@Injectable({ providedIn: 'root' })
export class ChannelsDataService {
  private readonly channelsApiClient: ChannelsApiClient =
    inject(ChannelsApiClient);

  public getChannels(): Signal<ChannelApiResponseModel[]> {
    return toSignal(this.channelsApiClient.get(), { initialValue: [] });
  }
}
