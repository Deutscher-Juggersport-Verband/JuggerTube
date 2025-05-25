import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly tokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(localStorage.getItem('jwt'));

  public get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  public setSession(token: string): void {
    localStorage.setItem('jwt', token);
    this.tokenSubject.next(token);
  }

  public clearSession(): void {
    localStorage.removeItem('jwt');
    this.tokenSubject.next(null);
  }

  public getToken(): string | null {
    return this.tokenSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
