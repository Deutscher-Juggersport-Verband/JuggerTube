import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BehaviorSubject, Observable } from 'rxjs';

import { UserRoleEnum } from '../enums/role-type.enum';
import { User, UserShort } from '../models/user-data.model';
import { convertFileToBase64Rule } from '@frontend/user';
import { AuthResponse, LoginRequestBody, RegisterRequestBody, RegisterResponse, UpdateRequestBody, UpdateResponse } from '../models/user-api.model';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataClient {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);
  private readonly sessionService: SessionService = inject(SessionService);

  private readonly privilegedUserShortOverviewCache$ = new BehaviorSubject<
    UserShort[]
  >([]);

  public getUserData$(username: string | undefined): Observable<User> {
    return this.http.get<User>(
      '/api/user-frontend/get-user-details' +
        (username !== undefined ? '/' + username : '')
    );
  }

  public getPrivilegedUserShortOverview$(): Observable<UserShort[]> {
    if (this.privilegedUserShortOverviewCache$.value.length === 0) {
      this.http
        .get<UserShort[]>(
          '/api/user-frontend/get-privileged-user-short-overview'
        )
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe((data) => this.privilegedUserShortOverviewCache$.next(data));
    }
    return this.privilegedUserShortOverviewCache$.asObservable();
  }

  public invalidatePrivilegedUserShortOverviewCache(): void {
    this.privilegedUserShortOverviewCache$.next([]);
  }

  public updateUserRole$(
    userId: number,
    role: UserRoleEnum
  ): Observable<void> {
    return this.http.put<void>('/api/user-frontend/update-user-role', {
      userId,
      role,
    });
  }

  public updatePicture$(file: File): Observable<string> {
    const base64 = convertFileToBase64Rule(file);

    return this.http.put<string>('/api/user-frontend/update-user-picture', {
      picture: base64,
    });
  }

  public loginUser$(body: LoginRequestBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/user-frontend/authenticate-user', body);
  }

  public registerUser$(body: RegisterRequestBody): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/user-frontend/create-user', body);
  }

  public updateUser(body: UpdateRequestBody): Observable<UpdateResponse> {
    return this.http.put<UpdateResponse>('/api/user-frontend/update-user', body);
  }

  //ToDo: Objekt definieren, welches zurückgegeben wird
  public deleteUser$(): Observable<Object> {
    return this.http.delete('/api/user-frontend/delete-user');
  }

  public isAdmin$(): Observable<boolean> {
    return this.http.get<boolean>('/api/user-frontend/is-admin');
  }

  public isPrivileged$(): Observable<boolean> {
    return this.http.get<boolean>('/api/user-frontend/is-privileged');
  }
}
