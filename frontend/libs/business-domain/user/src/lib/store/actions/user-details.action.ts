import { createAction, props } from '@ngrx/store';

import { userDetailsFeatureKey } from '../models/user-state.model';
import { User, UserRoleEnum } from '@frontend/user-data';

enum UserDetailsActionNamesEnum {
  LoadUserDetails = `[${userDetailsFeatureKey}] Load User Details`,
  LoadUserDetailsFailed = `[${userDetailsFeatureKey}] Load User Details Failed`,
  LoadUserDetailsSuccess = `[${userDetailsFeatureKey}] Load User Details Success`,
  ChangeUserDetails = `[${userDetailsFeatureKey}] Change User Details`,
  ChangeUserDetailsFailed = `[${userDetailsFeatureKey}] Change User Details Failed`,
  ChangeUserDetailsSuccess = `[${userDetailsFeatureKey}] Change User Details Success`,
  ChangeUserRole = `[${userDetailsFeatureKey}] Change User Role`,
  ChangeUserRoleFailed = `[${userDetailsFeatureKey}] Change User Role Failed`,
  ChangeUserRoleSuccess = `[${userDetailsFeatureKey}] Change User Role Success`,
  LoginUser = `[${userDetailsFeatureKey}] Login User`,
  LoginUserFailed = `[${userDetailsFeatureKey}] Login User Failed`,
  LoginUserSuccess = `[${userDetailsFeatureKey}] Login User Success`,
  RegisterUser = `[${userDetailsFeatureKey}] Register User`,
  RegisterUserFailed = `[${userDetailsFeatureKey}] Register User Failed`,
  RegisterUserSuccess = `[${userDetailsFeatureKey}] Register User Success`,
  UpdateUserPicture = `[${userDetailsFeatureKey}] Update User Picture`,
  UpdateUserPictureFailed = `[${userDetailsFeatureKey}] Update User Picture Failed`,
  UpdateUserPictureSuccess = `[${userDetailsFeatureKey}] Update User Picture Success`,
  DeleteUser = `[${userDetailsFeatureKey}] Delete User`,
  DeleteUserFailed = `[${userDetailsFeatureKey}] Delete User Failed`,
  DeleteUserSuccess = `[${userDetailsFeatureKey}] Delete User Success`,
  LoadUserRole = `[${userDetailsFeatureKey}] Load User Role`,
  LoadUserRoleFailed = `[${userDetailsFeatureKey}] Load User Role Failed`,
  LoadUserRoleSuccess = `[${userDetailsFeatureKey}] Load User Role Success`,
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

export const changeUserDetailsAction = createAction(
  UserDetailsActionNamesEnum.ChangeUserDetails,
  props<{ mail: string | null, name: string | null, username: string | null, password: string | null }>()
);

export const changeUserDetailsActionSuccess = createAction(UserDetailsActionNamesEnum.ChangeUserDetailsSuccess);

export const changeUserDetailsActionFailed = createAction(
  UserDetailsActionNamesEnum.ChangeUserDetailsFailed,
  props<{ error: string }>()
);

export const deleteUserAction = createAction(
  UserDetailsActionNamesEnum.DeleteUser
);

export const deleteUserActionSuccess = createAction(UserDetailsActionNamesEnum.DeleteUserSuccess);

export const deleteUserActionFailed = createAction(UserDetailsActionNamesEnum.DeleteUserFailed, props<{ error: string }>());

export const changeUserRoleAction = createAction(
  UserDetailsActionNamesEnum.ChangeUserRole,
  props<{ userId: number, userRole: UserRoleEnum }>() 
);

export const changeUserRoleActionSuccess = createAction(UserDetailsActionNamesEnum.ChangeUserRoleSuccess);

export const changeUserRoleActionFailed = createAction(UserDetailsActionNamesEnum.ChangeUserRoleFailed, props<{ error: string }>());

export const loginUserAction = createAction(
  UserDetailsActionNamesEnum.LoginUser,
  props<{ email: string, password: string }>()
);

export const loginUserActionSuccess = createAction(UserDetailsActionNamesEnum.LoginUserSuccess);

export const loginUserActionFailed = createAction(UserDetailsActionNamesEnum.LoginUserFailed, props<{ error: string }>());

export const registerUserAction = createAction(
  UserDetailsActionNamesEnum.RegisterUser,
  props<{ email: string, name: string, password: string, username: string }>()
);

export const registerUserActionSuccess = createAction(UserDetailsActionNamesEnum.RegisterUserSuccess);

export const registerUserActionFailed = createAction(UserDetailsActionNamesEnum.RegisterUserFailed, props<{ error: string }>());

export const updateUserPictureAction = createAction(
  UserDetailsActionNamesEnum.UpdateUserPicture,
  props<{ file: File }>()
);

export const updateUserPictureActionSuccess = createAction(UserDetailsActionNamesEnum.UpdateUserPictureSuccess);

export const updateUserPictureActionFailed = createAction(UserDetailsActionNamesEnum.UpdateUserPictureFailed, props<{ error: string }>());

export const loadUserRoleAction = createAction(
  UserDetailsActionNamesEnum.LoadUserRole
);

export const loadUserRoleActionSuccess = createAction(
  UserDetailsActionNamesEnum.LoadUserRoleSuccess,
  props<{ userRole: UserRoleEnum }>()
);

export const loadUserRoleActionFailed = createAction(
  UserDetailsActionNamesEnum.LoadUserRoleFailed,
  props<{ error: string }>()
);

export const clearUserDetailsAction = createAction(UserDetailsActionNamesEnum.ClearUserData);
