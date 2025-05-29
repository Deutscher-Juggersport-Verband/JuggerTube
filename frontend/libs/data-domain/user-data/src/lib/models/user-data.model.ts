import { RoleType } from '../enums/role-type.enum';

export interface User {
  id: number;
  createdAt: string;
  email: string;
  escaped_username: string;
  name: string;
  pictureUrl: string;
  role: RoleType;
  username: string;
}
