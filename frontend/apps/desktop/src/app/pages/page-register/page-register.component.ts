
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
import { registerForm, UsersDataService } from '@frontend/user';

@Component({
  imports: [
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    RouterLink
],
  standalone: true,
  templateUrl: './page-register.component.html',
  styleUrl: './page-register.component.less',
})
export class PageRegisterComponent {
  private readonly router: Router = inject(Router);
  private readonly usersDataService = inject(UsersDataService);

  protected readonly form = registerForm;
  // Users State Model Error
  protected error: string = '';

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      markAllFieldsAsTouched(this.form);
      return;
    }

    this.usersDataService.registerUser(
      this.form.value.email!,
      this.form.value.name!,
      this.form.value.password!,
      this.form.value.username!
    );

    this.form.reset();

    await this.router.navigate(['/']);
  }
}
