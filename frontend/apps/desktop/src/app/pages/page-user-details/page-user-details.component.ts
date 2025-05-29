import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  UiButtonColorEnum,
  UiButtonComponent,
  UiInputComponent,
  UiInputTypeEnum,
} from '../../ui-shared';
import { SingletonGetter } from '@frontend/cache';
import { userDetailsSelector } from '@frontend/user';
import { UpdateRequestBody, User, UserApiClient } from '@frontend/user-data';

export const userForm = new FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
  password: new FormControl(
    {
      value: '',
      disabled: true,
    },
    {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }
  ),
});

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
  ],
  standalone: true,
  templateUrl: './page-user-details.component.html',
  styleUrl: './page-user-details.component.less',
})
export class PageUserDetailsComponent {
  private readonly authService: UserApiClient = inject(UserApiClient);
  private readonly router: Router = inject(Router);
  private readonly store$: Store = inject(Store);

  protected readonly form = userForm;
  protected error: string = '';

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;

  @SingletonGetter()
  public get user$(): Observable<User | null> {
    return this.store$.select(userDetailsSelector);
  }

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      this.markAllFieldsAsTouched();
      return;
    }

    const response = await this.authService.update(
      this.form.value as UpdateRequestBody
    );

    if (response.error) {
      this.error = response.error;
      return;
    }

    this.form.reset();

    await this.router.navigate(['user-details']);
  }

  public onDelete(): void {
    this.authService.delete();

    this.router.navigate(['/']);
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
