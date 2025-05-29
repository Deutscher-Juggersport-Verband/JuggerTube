import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  UiButtonColorEnum,
  UiButtonComponent,
  UiInputComponent,
  UiInputTypeEnum, UiLabelRowComponent
} from '../../ui-shared';
import {
  AuthResponse,
  LoginRequestBody,
  UserApiClient,
} from '@frontend/user-data';

export const loginForm = new FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
  password: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  }),
});

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    UiLabelRowComponent,
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
      this.markAllFieldsAsTouched();
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
      this.error = response.error;
      return;
    }

    this.form.reset();

    await this.router.navigate(['/']);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}
