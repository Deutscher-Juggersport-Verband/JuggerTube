import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {differentTeamsValidator} from '../validators/different-teams.validator';
import {GameSystemTypesEnum, VideoCategoriesEnum, WeaponTypesEnum} from '@frontend/video-data';

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
}

@Injectable({ providedIn: 'root' })
export class VideoFormService {
  private currentForm: FormGroup<VideoFormModel> | null = null;

  public create(): FormGroup<VideoFormModel> {
    if (!this.currentForm) {
      this.currentForm = new FormGroup<VideoFormModel>({
        name: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        videoLink: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        channelLink: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        category: new FormControl({ value: null, disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        uploadDate: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        dateOfRecording: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        topic: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        guests: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        weaponType: new FormControl({ value: null, disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        gameSystem: new FormControl({ value: null, disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        tournamentId: new FormControl({ value: 0, disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        teamOneId: new FormControl({ value: 0, disabled: false }, {
          nonNullable: true,
          validators: [Validators.required, differentTeamsValidator],
        }),
        teamTwoId: new FormControl({ value: 0, disabled: false }, {
          nonNullable: true,
          validators: [Validators.required, differentTeamsValidator],
        }),
        teamOneCity: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        teamTwoCity: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        teamOneMix: new FormControl({ value: false, disabled: false }, {
          nonNullable: true,
        }),
        teamTwoMix: new FormControl({ value: false, disabled: false }, {
          nonNullable: true,
        }),
        comment: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        tournamentCity: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        tournamentStartDate: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        tournamentEndDate: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        tournamentAddress: new FormControl({ value: '', disabled: false }, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      });
    }
    return this.currentForm;
  }

  public resetForm(): void {
    this.currentForm = null;
  }

  public updateValidators(category: VideoCategoriesEnum): void {
    const form = this.create();

    // Reset all validators
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.clearValidators();
      form.get(key)?.updateValueAndValidity();
    });

    // Set required validators based on category
    form.get('name')?.setValidators([Validators.required]);
    form.get('videoLink')?.setValidators([Validators.required]);
    form.get('channelLink')?.setValidators([Validators.required]);
    form.get('category')?.setValidators([Validators.required]);
    form.get('uploadDate')?.setValidators([Validators.required]);
    form.get('dateOfRecording')?.setValidators([Validators.required]);

    switch (category) {
      case VideoCategoriesEnum.AWARDS:
        form.get('tournamentId')?.setValidators([Validators.required]);
        form.get('tournamentCity')?.setValidators([Validators.required]);
        form.get('tournamentStartDate')?.setValidators([Validators.required]);
        form.get('tournamentEndDate')?.setValidators([Validators.required]);
        break;
      case VideoCategoriesEnum.MATCH:
        form.get('gameSystem')?.setValidators([Validators.required]);
        form.get('tournamentId')?.setValidators([Validators.required]);
        form.get('teamOneId')?.setValidators([Validators.required, differentTeamsValidator]);
        form.get('teamTwoId')?.setValidators([Validators.required, differentTeamsValidator]);
        form.get('teamOneCity')?.setValidators([Validators.required]);
        form.get('teamTwoCity')?.setValidators([Validators.required]);
        break;
      case VideoCategoriesEnum.SPARBUILDING:
        form.get('weaponType')?.setValidators([Validators.required]);
        break;
      case VideoCategoriesEnum.TRAINING:
        form.get('weaponType')?.setValidators([Validators.required]);
        break;
      case VideoCategoriesEnum.REPORTS:
        form.get('topic')?.setValidators([Validators.required]);
        break;
    }

    // Update validity
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.updateValueAndValidity();
    });
  }
}
