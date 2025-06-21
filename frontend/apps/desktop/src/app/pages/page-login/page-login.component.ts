import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  UiButtonColorEnum,
  UiButtonComponent,
  UiInputComponent,
  UiInputTypeEnum,
} from '../../ui-shared';
import { markAllFieldsAsTouched } from '../../utils/form-utils';
import { loginForm } from '@frontend/user';
import {
  AuthResponse,
  LoginRequestBody,
  UserApiClient,
} from '@frontend/user-data';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.less',
})
export class PageLoginComponent {
  private readonly router: Router = inject(Router);
  private readonly authService: UserApiClient = inject(UserApiClient);

  protected readonly form = loginForm;
  protected error: string = '';

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      markAllFieldsAsTouched(this.form);
      return;
    }

    const response: AuthResponse = await this.authService.login(
      this.form.value as LoginRequestBody
    );

    if (response.lockedUntil && response.lockType) {
      this.error = `Dieser Account ist ${
        response.lockType
      } gesperrt bis ${new Date(response.lockedUntil).toLocaleString()}`;
      return;
    }

    if (response.error) {
      markAllFieldsAsTouched(this.form);
      this.error = response.error;
      return;
    }

    this.form.reset();

    await this.router.navigate(['/']);
  }
}
