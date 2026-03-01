import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';

import {
  UiButtonColorEnum,
  UiButtonComponent,
  UiInputComponent,
  UiInputTypeEnum,
} from '../../ui-shared';
import { markAllFieldsAsTouched } from '../../utils/form-utils';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { updateMailForm, updatePasswordForm, UsersDataService } from '@frontend/user';
import {
  User,
  UserRoleEnum,
} from '@frontend/user-data';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    AdminPanelComponent,
  ],
  standalone: true,
  templateUrl: './page-user-details.component.html',
  styleUrl: './page-user-details.component.less',
})
export class PageUserDetailsComponent {
  private readonly usersDataService = inject(UsersDataService);
  private readonly router: Router = inject(Router);
  private readonly actions$ = inject(Actions);

  protected readonly updateMailForm = updateMailForm;
  protected readonly updatePasswordForm = updatePasswordForm;
  // State Model Error
  protected error: string = '';
  protected pictureUrl?: string;
  protected showChangeMailForm: boolean = false;
  protected showChangePasswordForm: boolean = false;

  protected readonly user$: Observable<User | null> = this.usersDataService.currentUser$;

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;
  protected readonly UserRoleEnum = UserRoleEnum;

  public async onChangePasswordSubmit(): Promise<void> {
    if (!this.updatePasswordForm.valid) {
      markAllFieldsAsTouched(this.updatePasswordForm);
      return;
    }

    this.usersDataService.changeUserData(
      null,
      null,
      this.updatePasswordForm.value.password!,
      null
    );

    // if error markallfields as touched and set error

    this.updatePasswordForm.reset();

    await this.router.navigate(['/user-details']);
  }

  public async onChangeMailSubmit(): Promise<void> {
    if (!this.updateMailForm.valid) {
      markAllFieldsAsTouched(this.updateMailForm);
      return;
    }

    // change Mail
    // if error markallfields as touched and set error

    this.updateMailForm.reset();

    await this.router.navigate(['/user-details']);
  }

  public onChangeMail(): void {
    this.showChangeMailForm = !this.showChangeMailForm;
  }

  public onChangePassword(): void {
    this.showChangePasswordForm = !this.showChangePasswordForm;
  }

  public onCancelChangeMail(): void {
    this.showChangeMailForm = false;
  }

  public onCancelChangePassword(): void {
    this.showChangePasswordForm = false;
  }

  public onDelete(): void {
    this.usersDataService.deleteUser();

    this.router.navigate(['/']);
  }

  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length <= 0) {
      return;
    }

    const selectedFile: File = input.files[0];

    this.usersDataService.updateUserPicture(selectedFile);

    // Umgehen nach successfull Change
  }
}
