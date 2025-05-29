import { createReducer, on } from '@ngrx/store';

import {
  loadUserDetailsDataAction,
  loadUserDetailsDataActionFailed,
  loadUserDetailsDataActionSuccess,
} from '../actions/user-details.action';
import { initialState, UserDetailsState } from '../models/user-state.model';
import { RequestStateEnum } from '@frontend/api';

export const userDetailsDataReducer = createReducer(
  initialState,
  on(
    loadUserDetailsDataAction,
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Initial,
      error: null,
    })
  ),
  on(
    loadUserDetailsDataActionSuccess,
    (state, { userDetails }): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Success,
      userDetails: userDetails,
    })
  ),
  on(
    loadUserDetailsDataActionFailed,
    (state, { error }): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Error,
      error,
    })
  )
);
