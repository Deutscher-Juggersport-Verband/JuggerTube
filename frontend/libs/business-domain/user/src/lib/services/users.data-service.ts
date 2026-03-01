import { inject, Injectable } from '@angular/core';
import { User, UserRoleEnum } from '@frontend/user-data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { userDetailsSelector } from '../store/selectors/user-details.selector';
import { SingletonGetter } from '@frontend/cache';
import { changeUserDetailsAction, changeUserRoleAction, clearUserDetailsAction, deleteUserAction, loadUserDetailsDataAction, loginUserAction, registerUserAction, updateUserPictureAction } from '@frontend/user';

@Injectable({ providedIn: 'root' })
export class UsersDataService {
  private readonly store$: Store = inject(Store);

  @SingletonGetter()
  public get currentUser$(): Observable<User | null> {
    return this.store$.select(userDetailsSelector);
  }

  public loadUserData(escapedUsername: string | undefined): void {
    this.store$.dispatch(loadUserDetailsDataAction({escapedUsername}));
  }

  public changeUserData( mail: string | null, name: string | null, password: string | null, username: string | null): void {
    this.store$.dispatch(changeUserDetailsAction({ mail, name, password, username }));
  }

  public deleteUser(): void {
    this.store$.dispatch(deleteUserAction());
  }

  public clearUserData(): void {
    this.store$.dispatch(clearUserDetailsAction());
  }

  public changeUserRole(userId: number, role: UserRoleEnum): void {
    this.store$.dispatch(changeUserRoleAction({ userId: userId, userRole: role }));
  }

  public loginUser(email: string, password: string): void {
    this.store$.dispatch(loginUserAction({ email, password }));
  }

  public registerUser(email: string, name: string, password: string, username: string): void {
    this.store$.dispatch(registerUserAction({ email, name, password, username }));
  }

  public updateUserPicture(file: File): void {
    this.store$.dispatch(updateUserPictureAction({ file }));
  }
}
