import { RequestStateEnum } from '@frontend/api';
import { User } from '@frontend/user-data';

export const userDetailsFeatureKey = 'userDetails';

export const initialState: UserDetailsState = {
  userDetails: null,
  loadingState: RequestStateEnum.Initial,
  error: null,
};

export interface UserDetailsState {
  userDetails: User | null;
  loadingState: RequestStateEnum;
  error: string | null;
}
