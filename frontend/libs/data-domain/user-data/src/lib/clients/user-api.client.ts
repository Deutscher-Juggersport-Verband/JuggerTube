import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';

import {
  AuthResponse,
  LoginRequestBody,
  RegisterRequestBody,
  RegisterResponse,
  UpdateRequestBody,
  UpdateResponse,
} from '../models/user-api.model';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class UserApiClient {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly sessionService: SessionService = inject(SessionService);

  public async login(body: LoginRequestBody): Promise<AuthResponse> {
    return await firstValueFrom(
      this.http
        .post<AuthResponse>('/api/user-frontend/authenticate-user', body)
        .pipe(
          tap((response: AuthResponse) => {
            if (response.token) {
              this.sessionService.setSession(response.token);
            }
          }),
          catchError((error): Observable<AuthResponse> => {
            if (error.status !== 200 && error.error) {
              return of(error.error);
            }
            throw error;
          })
        )
    );
  }

  public async register(body: RegisterRequestBody): Promise<RegisterResponse> {
    return await firstValueFrom(
      this.http
        .post<RegisterResponse>('/api/user-frontend/create-user', body)
        .pipe(
          tap((response: RegisterResponse) => {
            if (response.token) {
              this.sessionService.setSession(response.token);
            }
          }),
          catchError((error): Observable<RegisterResponse> => {
            if (error.status !== 200 && error.error) {
              return of(error.error);
            }
            throw error;
          })
        )
    );
  }

  public async update(body: UpdateRequestBody): Promise<UpdateResponse> {
    return await firstValueFrom(
      this.http
        .put<UpdateResponse>('/api/user-frontend/update-user', body)
        .pipe(
          tap((response: UpdateResponse) => {
            if (response.token) {
              this.sessionService.setSession(response.token);
            }
          }),
          catchError((error): Observable<UpdateResponse> => {
            if (error.status !== 200 && error.error) {
              return of(error.error);
            }
            throw error;
          })
        )
    );
  }

  public async delete(): Promise<void> {
    await firstValueFrom(this.http.delete('/api/user-frontend/delete-user'));
    this.sessionService.clearSession();
  }

  public async isAdmin(): Promise<boolean> {
    return await firstValueFrom(
      this.http.get<boolean>('/api/user-frontend/is-admin')
    );
  }

  public async isPrivileged(): Promise<boolean> {
    return await firstValueFrom(
      this.http.get<boolean>('/api/user-frontend/is-privileged')
    );
  }
}
