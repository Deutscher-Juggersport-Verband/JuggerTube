import { UserRoleEnum } from '../enums/role-type.enum';

export interface User {
  id: number;
  createdAt: string;
  email: string;
  escaped_username: string;
  name: string;
  pictureUrl: string;
  role: UserRoleEnum;
  username: string;
}

export interface UserShort {
  id: number;
  escapedUsername: string;
  name: string;
  pictureUrl: string;
  role: UserRoleEnum;
  username: string;
}

export interface UpdateUserPictureResponse {
  pictureUrl: string;
}
