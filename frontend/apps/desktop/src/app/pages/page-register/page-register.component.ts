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
import { registerForm } from '@frontend/user';
import {
  RegisterRequestBody,
  RegisterResponse,
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
