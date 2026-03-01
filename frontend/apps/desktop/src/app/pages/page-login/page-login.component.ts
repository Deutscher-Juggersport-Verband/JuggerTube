
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
import { loginForm, UsersDataService } from '@frontend/user';

@Component({
  imports: [
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    RouterLink
],
  standalone: true,
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.less',
})
export class PageLoginComponent {
  private readonly router: Router = inject(Router);
  private readonly usersDataService = inject(UsersDataService);

  protected readonly form = loginForm;
  // Users State Model Error
  protected error: string = '';

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      markAllFieldsAsTouched(this.form);
      return;
    }

    this.usersDataService.loginUser(
      this.form.value.email!,
      this.form.value.password!
    );

    /* if (response.lockedUntil && response.lockType) {
      this.error = `Dieser Account ist ${
        response.lockType
      } gesperrt bis ${new Date(response.lockedUntil).toLocaleString()}`;
      return;
    }

    if (response.error) {
      markAllFieldsAsTouched(this.form);
      this.error = response.error;
      return;
    } */

    this.form.reset();

    await this.router.navigate(['/']);
  }
}
