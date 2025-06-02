import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

import { UserRoleEnum } from '../enums/role-type.enum';
import { User, UserShort } from '../models/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataClient {
  private readonly http: HttpClient = inject(HttpClient);

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
        .subscribe((data) => this.privilegedUserShortOverviewCache$.next(data));
    }
    return this.privilegedUserShortOverviewCache$.asObservable();
  }

  public invalidatePrivilegedUserShortOverviewCache(): void {
    this.privilegedUserShortOverviewCache$.next([]);
  }

  public async updateUserRole$(
    userId: number,
    role: UserRoleEnum
  ): Promise<void> {
    return await firstValueFrom(
      this.http.put<void>('/api/user-frontend/update-user-role', {
        userId,
        role,
      })
    );
  }
}
