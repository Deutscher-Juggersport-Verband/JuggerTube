import { createReducer, on } from '@ngrx/store';

import {
  changeUserRoleAction,
  changeUserDetailsActionSuccess,
  clearUserDetailsAction,
  loadUserDetailsDataAction,
  loadUserDetailsDataActionFailed,
  loadUserDetailsDataActionSuccess,
  loadUserRoleAction,
  loadUserRoleActionFailed,
  changeUserDetailsActionFailed,
  loadUserRoleActionSuccess,
  changeUserRoleActionSuccess,
  changeUserRoleActionFailed,
  changeUserDetailsAction,
  loginUserAction,
  loginUserActionFailed,
  loginUserActionSuccess,
  registerUserAction,
  registerUserActionSuccess,
  registerUserActionFailed,
  updateUserPictureAction,
  updateUserPictureActionSuccess,
  updateUserPictureActionFailed,
  deleteUserAction,
  deleteUserActionFailed,
  deleteUserActionSuccess,
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
  ),
  on(
    changeUserDetailsAction,
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Initial,
      error: null,
    })
  ),
  on(
    changeUserDetailsActionFailed,
    (state, { error }): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Error,
      error,
    })
  ),
  on(changeUserDetailsActionSuccess, (state): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Success,
  })),
  on(
    changeUserRoleAction, 
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Initial,
      error: null,
    })
  ),
  on(
    changeUserRoleActionFailed,
    (state, { error }): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Error,
      error,
    })
  ),
  on(changeUserRoleActionSuccess, (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Success,
    })
  ),
  on(
    loginUserAction,
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Initial,
      error: null,
    })
  ),
  on(loginUserActionFailed, (state, { error }): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Error,
    error,
  })),
  on(
    loginUserActionSuccess,
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Success,
    })
  ),
  on(
    registerUserAction,
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Initial,
      error: null,
    })
  ),
  on(registerUserActionFailed, (state, { error }): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Error,
    error,
  })),
  on(registerUserActionSuccess, (state): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Success,
  })),
  on( updateUserPictureAction, (state): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Initial,
    error: null,
  })),
  on(updateUserPictureActionFailed, (state, { error }): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Error,
    error,
  })),
  on(updateUserPictureActionSuccess, (state): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Success,
  })),
  on(
    deleteUserAction,
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Initial,
      error: null,
    })
  ),
  on(deleteUserActionFailed, (state, { error }): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Error,
    error,
  })),
  on(deleteUserActionSuccess, (state): UserDetailsState => ({
    ...state,
    loadingState: RequestStateEnum.Success,
    userDetails: null,
  })),
  on(
    loadUserRoleAction,
    (state): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Initial,
      error: null,
    })
  ),
  on(
    loadUserRoleActionFailed,
    (state, { error }): UserDetailsState => ({
      ...state,
      loadingState: RequestStateEnum.Error,
      error,
    })
  ),
  on(loadUserRoleActionSuccess, (state, { userRole }): UserDetailsState => ({
    ...state,
    userDetails: state.userDetails ? {
      ...state.userDetails,
      role: userRole,
    } : null,
  })),
  on(clearUserDetailsAction, (state) => ({
    ...state,
    userDetails: null,
    error: null,
  })),
);
