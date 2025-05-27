import { Injectable, Signal } from '@angular/core';
import {
  ChannelApiResponseModel,
  ChannelsApiClient,
} from '@frontend/channel-data';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ChannelsDataService {
  constructor(private readonly channelsApiClient: ChannelsApiClient) {}

  public getChannels(): Signal<ChannelApiResponseModel[] | undefined> {
    return toSignal(this.channelsApiClient.get());
  }
}
