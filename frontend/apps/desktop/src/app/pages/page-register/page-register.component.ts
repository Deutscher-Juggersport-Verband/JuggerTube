import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  UiButtonColorEnum,
  UiButtonComponent,
  UiInputComponent,
  UiInputTypeEnum,
} from '../../ui-shared';
import { markAllFieldsAsTouched } from '../../utils/form-utils';
import {
  RegisterRequestBody,
  RegisterResponse,
  UserApiClient,
} from '@frontend/user-data';

export const PasswordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordsMismatch: true }
    : null;
};

export const registerForm = new FormGroup<{
  confirmPassword: FormControl<string>;
  email: FormControl<string>;
  name: FormControl<string>;
  password: FormControl<string>;
  username: FormControl<string>;
}>(
  {
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl('', { nonNullable: true }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
  },
  { validators: PasswordsMatchValidator }
);

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './page-register.component.html',
  styleUrl: './page-register.component.less',
})
export class PageRegisterComponent {
  private readonly router: Router = inject(Router);
  private readonly authService: UserApiClient = inject(UserApiClient);

  protected readonly form = registerForm;
  protected error: string = '';

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      markAllFieldsAsTouched(this.form);
      return;
    }

    const response: RegisterResponse = await this.authService.register(
      this.form.value as RegisterRequestBody
    );

    if (response.error) {
      markAllFieldsAsTouched(this.form);
      this.error = response.error;
      return;
    }

    this.form.reset();

    await this.router.navigate(['/']);
  }
}
