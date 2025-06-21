import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import {
  notZeroValidator,
  updateAllControlsValidity,
} from '../../../../../../apps/desktop/src/app/utils/form-utils';
import { determineAdditionalFieldsRule } from '../rules/determineAdditionalFields.rule';
import { differentTeamsValidator } from '@frontend/team';
import {
  GameSystemTypesEnum,
  VideoCategoriesEnum,
  WeaponTypesEnum,
} from '@frontend/video-data';

export enum AdditionalFieldsEnum {
  GAME_SYSTEM = 'gameSystem',
  WEAPON_TYPE = 'weaponType',
  TOPIC = 'topic',
  GUESTS = 'guests',
  TEAMS = 'teams',
  TOURNAMENT = 'tournament',
}

export type VideoFormModel = {
  name: FormControl<string>;
  videoLink: FormControl<string>;
  channelId: FormControl<number>;
  channelLink: FormControl<string>;
  category: FormControl<VideoCategoriesEnum | null>;
  uploadDate: FormControl<string>;
  dateOfRecording: FormControl<string>;
  topic: FormControl<string>;
  guests: FormControl<string>;
  weaponType: FormControl<WeaponTypesEnum | null>;
  gameSystem: FormControl<GameSystemTypesEnum | null>;
  tournamentId: FormControl<number>;
  teamOneId: FormControl<number>;
  teamTwoId: FormControl<number>;
  teamOneCity: FormControl<string>;
  teamTwoCity: FormControl<string>;
  teamOneMix: FormControl<boolean>;
  teamTwoMix: FormControl<boolean>;
  comment: FormControl<string>;
  tournamentCity: FormControl<string>;
  tournamentStartDate: FormControl<string>;
  tournamentEndDate: FormControl<string>;
  tournamentAddress: FormControl<string>;
};

@Injectable({ providedIn: 'root' })
export class VideoFormService {
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);

  private currentForm: FormGroup<VideoFormModel> | null = null;
  private readonly additionalFieldsSubject: BehaviorSubject<
    AdditionalFieldsEnum[]
  > = new BehaviorSubject<AdditionalFieldsEnum[]>([]);

  public additionalFields$: Signal<AdditionalFieldsEnum[]>;

  constructor() {
    this.additionalFields$ = toSignal(this.additionalFieldsSubject, {
      initialValue: [],
    });
  }

  public create(): FormGroup<VideoFormModel> {
    this.currentForm ??= this.setupForm();
    this.setupCategorySubscription();
    return this.currentForm;
  }

  private setupForm(): FormGroup<VideoFormModel> {
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
          { value: 0, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required, notZeroValidator],
          }
        ),
        channelLink: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
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
            validators: [Validators.required],
          }
        ),
        dateOfRecording: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        topic: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        guests: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        weaponType: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        gameSystem: new FormControl(
          { value: null, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        tournamentId: new FormControl(
          { value: 0, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        teamOneId: new FormControl(
          { value: 0, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        teamTwoId: new FormControl(
          { value: 0, disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        teamOneCity: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        teamTwoCity: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
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
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        tournamentCity: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        tournamentStartDate: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        tournamentEndDate: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
        tournamentAddress: new FormControl(
          { value: '', disabled: false },
          {
            nonNullable: true,
            validators: [Validators.required],
          }
        ),
      },
      { validators: [differentTeamsValidator()] }
    );
  }

  private setupCategorySubscription(): void {
    if (!this.currentForm) return;

    this.currentForm.controls.category.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((value: VideoCategoriesEnum | null) => {
        this.additionalFieldsSubject.next(
          value ? determineAdditionalFieldsRule(value) : []
        );

        this.updateFormValidation();
      });
  }

  private updateFormValidation(): void {
    this.clearAdditionalFieldsValidators();

    this.addFittingAdditionalFieldsValidators();

    if (!this.currentForm) return;
    updateAllControlsValidity(this.currentForm);
  }

  private clearAdditionalFieldsValidators(): void {
    if (!this.currentForm) return;

    this.currentForm.controls.topic.clearValidators();
    this.currentForm.controls.guests.clearValidators();
    this.currentForm.controls.weaponType.clearValidators();
    this.currentForm.controls.gameSystem.clearValidators();
    this.currentForm.controls.tournamentId.clearValidators();
    this.currentForm.controls.teamOneId.clearValidators();
    this.currentForm.controls.teamTwoId.clearValidators();
    this.currentForm.controls.teamOneCity.clearValidators();
    this.currentForm.controls.teamTwoCity.clearValidators();
    this.currentForm.controls.tournamentCity.clearValidators();
    this.currentForm.controls.tournamentStartDate.clearValidators();
    this.currentForm.controls.tournamentEndDate.clearValidators();
    this.currentForm.controls.tournamentAddress.clearValidators();
  }

  private addFittingAdditionalFieldsValidators(): void {
    this.additionalFields$().forEach((field: AdditionalFieldsEnum) => {
      if (!this.currentForm) return;

      switch (field) {
        case AdditionalFieldsEnum.TOPIC:
          this.currentForm.controls.topic.addValidators(Validators.required);
          break;
        case AdditionalFieldsEnum.GUESTS:
          this.currentForm.controls.guests.addValidators(Validators.required);
          break;
        case AdditionalFieldsEnum.WEAPON_TYPE:
          this.currentForm.controls.weaponType.addValidators(
            Validators.required
          );
          break;
        case AdditionalFieldsEnum.GAME_SYSTEM:
          this.currentForm.controls.gameSystem.addValidators(
            Validators.required
          );
          break;
        case AdditionalFieldsEnum.TOURNAMENT:
          this.currentForm.controls.tournamentId.addValidators(
            Validators.required
          );
          if (this.currentForm.controls.teamOneCity.value !== '') {
            this.currentForm.controls.tournamentCity.addValidators(
              Validators.required
            );
            this.currentForm.controls.tournamentStartDate.addValidators(
              Validators.required
            );
            this.currentForm.controls.tournamentEndDate.addValidators(
              Validators.required
            );
            this.currentForm.controls.tournamentAddress.addValidators(
              Validators.required
            );
          }
          break;
        case AdditionalFieldsEnum.TEAMS:
          this.currentForm.controls.teamOneId.addValidators([
            Validators.required,
          ]);
          this.currentForm.controls.teamTwoId.addValidators([
            Validators.required,
          ]);
          this.currentForm.addValidators(differentTeamsValidator());
          if (this.currentForm.controls.teamOneCity.value !== '') {
            this.currentForm.controls.teamOneCity.addValidators(
              Validators.required
            );
          }
          if (this.currentForm.controls.teamTwoCity.value !== '') {
            this.currentForm.controls.teamTwoCity.addValidators(
              Validators.required
            );
          }
          break;
      }
    });
  }
}
