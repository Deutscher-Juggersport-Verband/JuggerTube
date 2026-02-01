import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import {
  notZeroValidator,
  updateAllControlsValidity,
} from '../../../../../../apps/desktop/src/app/utils/form-utils';
import { VideoFormModel } from '../models/video-form.model';
import { dateIsNotInFutureValidator, differentTeamsValidator, uploadDateIsAfterRecordDateValidator } from '@frontend/video';
import {
  CategoriesAdditionalFieldsConfig,
  CreateNewEntityAdditionalFieldsConfig,
  CreateNewEntityTypesEnum,
  EntityIdFieldMap,
  VideoCategoriesEnum,
  VideoFormAllAdditionalFields,
} from '@frontend/video-data';

@Injectable({ providedIn: 'root' })
export class VideoFormService {
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);

  private currentForm: FormGroup<VideoFormModel> | null = null;
  private readonly categoriesAdditionalFieldsSubject: BehaviorSubject<
    CategoriesAdditionalFieldsConfig[]
  > = new BehaviorSubject<CategoriesAdditionalFieldsConfig[]>([]);
  public categoriesAdditionalFieldsConfig: Signal<CategoriesAdditionalFieldsConfig[]>;

  constructor() {
    this.categoriesAdditionalFieldsConfig = toSignal(this.categoriesAdditionalFieldsSubject, {
      initialValue: [],
    });
  }

  public create(): FormGroup<VideoFormModel> {
    this.currentForm ??= this.setupBaseForm();
    this.setupCategorySubscription();
    return this.currentForm;
  }

  public changeFormRequirementsToCreateNewEntity(entityType: CreateNewEntityTypesEnum): void {
    if (!this.currentForm) return;

    const existingEntityIdFieldName = EntityIdFieldMap[entityType];
    const existingEntityFieldControl = this.currentForm?.get(existingEntityIdFieldName)
    if (existingEntityFieldControl) {
      existingEntityFieldControl.clearValidators();
      existingEntityFieldControl.reset();
      existingEntityFieldControl.setErrors([]);
      existingEntityFieldControl.markAsPristine();
      existingEntityFieldControl.markAsUntouched();
      existingEntityFieldControl.updateValueAndValidity();
    }

    CreateNewEntityAdditionalFieldsConfig[entityType].forEach((field) => {
      const control = this.currentForm?.get(field);
      if (control) {
        control.addValidators(Validators.required);
        control.updateValueAndValidity();
      }
    });
  };

  public changeFormRequirementsToExistingEntity(entityType: CreateNewEntityTypesEnum): void {
    if (!this.currentForm) return;

    CreateNewEntityAdditionalFieldsConfig[entityType].forEach((field) => {
      const control = this.currentForm?.get(field);
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });

    const existingEntityIdFieldName = EntityIdFieldMap[entityType];
    const existingEntityFieldControl = this.currentForm?.get(existingEntityIdFieldName)

    if (existingEntityFieldControl) {
      existingEntityFieldControl.addValidators(Validators.required);
      existingEntityFieldControl.updateValueAndValidity();
    }
  }

  private setupBaseForm(): FormGroup<VideoFormModel> {
    return new FormGroup<VideoFormModel>(
      {
        name: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        videoLink: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        channelId: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required, notZeroValidator],
          }
        ),
        category: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        uploadDate: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required, dateIsNotInFutureValidator()],
          }
        ),
        dateOfRecording: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required, dateIsNotInFutureValidator()],
          }
        ),
        topic: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        guests: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        weaponType: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        gameSystem: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        tournamentId: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamOneId: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamTwoId: new FormControl(
          { value: 0, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamOneCity: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamTwoCity: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamOneMix: new FormControl(
          { value: false, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamTwoMix: new FormControl(
          { value: false, disabled: false },
          {
            nonNullable: true,
          }
        ),
        comment: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        tournamentCity: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        tournamentStartDate: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        tournamentEndDate: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        channelLink: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        channelName: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        tournamentName: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamOneName: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
        teamTwoName: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
          }
        ),
      },
      { validators: [differentTeamsValidator(), uploadDateIsAfterRecordDateValidator()] }
    );
  }

  private setupCategorySubscription(): void {
    if (!this.currentForm) return;

    this.currentForm.controls.category.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((value: VideoCategoriesEnum | null) => {
        this.categoriesAdditionalFieldsSubject.next(
          value ? CategoriesAdditionalFieldsConfig[value] : []
        );

        this.updateFormValidationAfterCategoryChange(value);
      });
  }

  private updateFormValidationAfterCategoryChange(category: VideoCategoriesEnum | null): void {
    this.clearCategoriesOptionalFieldsValidators();

    this.addFittingCategoriesOptionalFieldsValidators(category);

    if (!this.currentForm) return;
    updateAllControlsValidity(this.currentForm);
  }

  private clearCategoriesOptionalFieldsValidators(): void {
    if (!this.currentForm) return;

    Object.values(VideoFormAllAdditionalFields).forEach((field) => {
      const control = this.currentForm?.get(field);
      if (control) {
        control.clearValidators();
      }
    });
  }

  private addFittingCategoriesOptionalFieldsValidators(category: VideoCategoriesEnum | null): void {
    if (!this.currentForm || !category) {
      return
    };

    switch (category) {
      case VideoCategoriesEnum.MATCH:
        this.currentForm?.controls.tournamentId.addValidators(Validators.required);
        this.currentForm?.controls.gameSystem.addValidators(Validators.required);
        this.currentForm?.controls.teamOneId.addValidators(Validators.required);
        this.currentForm?.controls.teamTwoId.addValidators(Validators.required);
        break;
      case VideoCategoriesEnum.SPARBUILDING:
        this.currentForm?.controls.weaponType.addValidators(Validators.required);
        break;
    }
  }
}
