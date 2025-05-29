import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { VideosState } from '../models/videos-state.model';
import { videosReducer } from './videos.reducer';
import { userDetailsDataReducer, UserDetailsState } from '@frontend/user';

export interface State {
  userDetails: UserDetailsState;
  videoOverview: VideosState;
}

export const reducers: ActionReducerMap<State> = {
  userDetails: userDetailsDataReducer,
  videoOverview: videosReducer,
};

export function localStorageSyncReducer(
  // eslint-disable-next-line
  reducer: ActionReducer<any>
  // eslint-disable-next-line
): ActionReducer<any> {
  return localStorageSync({
    keys: ['userDetails', 'videoOverview'],
    storage: localStorage,
    rehydrate: true,
  })(reducer);
}

export const metaReducers: MetaReducer<State>[] = [localStorageSyncReducer];
