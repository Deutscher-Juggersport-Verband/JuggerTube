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
import { markAllFieldsAsTouched } from '../../utils/form-utils';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { SingletonGetter } from '@frontend/cache';
import { userDetailsSelector } from '@frontend/user';
import {
  UpdateRequestBody,
  UpdateResponse,
  User,
  UserApiClient,
  UserDataClient,
} from '@frontend/user-data';

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
    AdminPanelComponent,
  ],
  standalone: true,
  templateUrl: './page-user-details.component.html',
  styleUrl: './page-user-details.component.less',
})
export class PageUserDetailsComponent {
  private readonly userApiClient: UserApiClient = inject(UserApiClient);
  private readonly userDataClient: UserDataClient = inject(UserDataClient);
  private readonly router: Router = inject(Router);
  private readonly store$: Store = inject(Store);

  protected readonly form = userForm;
  protected error: string = '';
  protected readonly isAdmin: Promise<boolean> = this.userApiClient.isAdmin();
  protected pictureUrl?: string;

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;

  @SingletonGetter()
  public get user$(): Observable<User | null> {
    return this.store$.select(userDetailsSelector);
  }

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      markAllFieldsAsTouched(this.form);
      return;
    }

    const response: UpdateResponse = await this.userApiClient.update(
      this.form.value as UpdateRequestBody
    );

    if (response.error) {
      markAllFieldsAsTouched(this.form);
      this.error = response.error;
      return;
    }

    this.form.reset();

    await this.router.navigate(['user-details']);
  }

  public onDelete(): void {
    this.userApiClient.delete();

    this.router.navigate(['/']);
  }

  public async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length <= 0) {
      return;
    }

    const selectedFile: File = input.files[0];

    this.pictureUrl = await this.userDataClient.updatePicture$(selectedFile);
  }
}
