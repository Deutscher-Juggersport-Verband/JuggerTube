import { createAction, props } from '@ngrx/store';

import { userDetailsFeatureKey } from '../models/user-state.model';
import { User } from '@frontend/user-data';

enum UserDetailsActionNamesEnum {
  LoadUserDetails = `[${userDetailsFeatureKey}] Load User Details`,
  LoadUserDetailsFailed = `[${userDetailsFeatureKey}] Load User Details Failed`,
  LoadUserDetailsSuccess = `[${userDetailsFeatureKey}] Load User Details Success`,
  ClearUserData = `[${userDetailsFeatureKey}] Clear User Data`,
}

export const loadUserDetailsDataAction = createAction(
  UserDetailsActionNamesEnum.LoadUserDetails,
  props<{ escapedUsername: string | undefined }>()
);

export const loadUserDetailsDataActionSuccess = createAction(
  UserDetailsActionNamesEnum.LoadUserDetailsSuccess,
  props<{ userDetails: User }>()
);

export const loadUserDetailsDataActionFailed = createAction(
  UserDetailsActionNamesEnum.LoadUserDetailsFailed,
  props<{ error: string }>()
);

export const clearUserDetailsAction = createAction(UserDetailsActionNamesEnum.ClearUserData);
