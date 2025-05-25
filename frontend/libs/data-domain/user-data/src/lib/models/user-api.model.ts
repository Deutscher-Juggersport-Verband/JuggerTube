import { LockType } from '../enums/lock-type.enum';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  email: string;
  name: string;
  password: string;
  username: string;
}

export interface UpdateRequestBody {
  email: string;
  name: string | null;
  password: string | null;
  username: string | null;
}

export interface AuthResponse {
  token?: string;
  lockType?: LockType;
  lockedUntil?: string;
  error?: string;
}

export interface RegisterResponse {
  token?: string;
  error?: string;
}

export interface UpdateResponse {
  token?: string;
  error?: string;
}
