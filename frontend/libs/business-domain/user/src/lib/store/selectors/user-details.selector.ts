import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  userDetailsFeatureKey,
  UserDetailsState,
} from '../models/user-state.model';

export const userDetailsStateSelector = createFeatureSelector<UserDetailsState>(
  userDetailsFeatureKey
);

export const userDetailsSelector = createSelector(
  userDetailsStateSelector,
  (state: UserDetailsState) => state.userDetails
);

export const userDetailsIdSelector = createSelector(
  userDetailsStateSelector,
  (state: UserDetailsState) => state.userDetails?.id
);

export const userDetailsNameSelector = createSelector(
  userDetailsStateSelector,
  (state: UserDetailsState) => state.userDetails?.name
);
