import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { User } from '../models/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataClient {
  private readonly http: HttpClient = inject(HttpClient);

  public getUserData$(username: string | undefined): Observable<User> {
    return this.http.get<User>(
      '/api/user-frontend/get-user-details' +
        (username !== undefined ? '/' + username : '')
    );
  }
}
