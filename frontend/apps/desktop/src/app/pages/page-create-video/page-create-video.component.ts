import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UiAutocompleteInputComponent } from '../../shared/ui-autocomplete-input/ui-autocomplete-input.component';
import {
  UiButtonColorEnum,
  UiButtonComponent,
} from '../../shared/ui-button/ui-button.component';
import {
  UiInputComponent,
  UiInputTypeEnum,
} from '../../shared/ui-input/ui-input.component';
import { UiLabelRowComponent } from '../../shared/ui-label-row/ui-label-row.component';
import { ChannelsDataService } from '@frontend/channel';
import { ChannelApiResponseModel } from '@frontend/channel-data';
import { TeamsDataService } from '@frontend/team';
import { TeamApiResponseModel } from '@frontend/team-data';
import { TournamentsDataService } from '@frontend/tournament';
import { TournamentApiResponseModel } from '@frontend/tournament-data';
import {
  AdditionalFieldsEnum,
  ToastService,
  VideoFormModel,
  VideoFormService,
  VideosDataService,
} from '@frontend/video';
import {
  CreateVideoRequest,
  GameSystemTypesEnum,
  VideoCategoriesEnum,
  WeaponTypesEnum,
} from '@frontend/video-data';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    UiButtonComponent,
    UiInputComponent,
    UiAutocompleteInputComponent,
    UiLabelRowComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './page-create-video.component.html',
  styleUrl: './page-create-video.component.less',
})
export class PageCreateVideoComponent implements OnInit {
  public teams: Signal<TeamApiResponseModel[] | undefined>;
  public tournaments: Signal<TournamentApiResponseModel[] | undefined>;
  public channels: Signal<ChannelApiResponseModel[] | undefined>;

  protected readonly form: FormGroup<VideoFormModel>;
  protected additionalFields: AdditionalFieldsEnum[] = [];
  protected showNewTournamentFields = false;
  protected showNewTeamOneFields = false;
  protected showNewTeamTwoFields = false;
  protected showNewChannelFields = false;
  protected isTeamOneMix = false;
  protected isTeamTwoMix = false;

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;
  protected readonly Object = Object;
  protected readonly VideoCategoriesEnum = VideoCategoriesEnum;
  protected readonly WeaponTypesEnum = WeaponTypesEnum;
  protected readonly GameSystemTypesEnum = GameSystemTypesEnum;
  protected readonly AdditionalFieldsEnum = AdditionalFieldsEnum;

  constructor(
    private readonly tournamentService: TournamentsDataService,
    private readonly teamService: TeamsDataService,
    private readonly channelsDataService: ChannelsDataService,
    private readonly videoFormService: VideoFormService,
    private readonly videosDataService: VideosDataService,
    private readonly toastService: ToastService
  ) {
    this.teams = this.teamService.getTeams();
    this.tournaments = this.tournamentService.getTournaments();
    this.channels = this.channelsDataService.getChannels();
    this.form = this.videoFormService.create();
  }

  public ngOnInit() {
    this.form.controls.category.valueChanges.subscribe(
      (value: VideoCategoriesEnum | null) => {
        if (!value) {
          this.additionalFields = [];
          this.updateFormValidation();
          return;
        }

        switch (value) {
          case VideoCategoriesEnum.REPORTS:
            this.additionalFields = [AdditionalFieldsEnum.TOPIC];
            break;
          case VideoCategoriesEnum.HIGHLIGHTS:
            this.additionalFields = [
              AdditionalFieldsEnum.TOPIC,
              AdditionalFieldsEnum.GUESTS,
              AdditionalFieldsEnum.TOURNAMENT,
            ];
            break;
          case VideoCategoriesEnum.SPARBUILDING:
            this.additionalFields = [
              AdditionalFieldsEnum.WEAPON_TYPE,
              AdditionalFieldsEnum.TOPIC,
              AdditionalFieldsEnum.GUESTS,
            ];
            break;
          case VideoCategoriesEnum.MATCH:
            this.additionalFields = [
              AdditionalFieldsEnum.TOURNAMENT,
              AdditionalFieldsEnum.GAME_SYSTEM,
              AdditionalFieldsEnum.TEAMS,
            ];
            break;
          case VideoCategoriesEnum.OTHER:
          case VideoCategoriesEnum.PODCAST:
            this.additionalFields = [
              AdditionalFieldsEnum.TOPIC,
              AdditionalFieldsEnum.GUESTS,
            ];
            break;
          case VideoCategoriesEnum.TRAINING:
            this.additionalFields = [
              AdditionalFieldsEnum.GAME_SYSTEM,
              AdditionalFieldsEnum.WEAPON_TYPE,
              AdditionalFieldsEnum.TOPIC,
            ];
            break;
          case VideoCategoriesEnum.AWARDS:
            this.additionalFields = [AdditionalFieldsEnum.TOURNAMENT];
            break;
          default:
            this.additionalFields = [];
        }
        this.updateFormValidation();
      }
    );
  }

  private updateFormValidation(): void {
    // Reset all additional fields
    this.form.controls.topic.clearValidators();
    this.form.controls.guests.clearValidators();
    this.form.controls.weaponType.clearValidators();
    this.form.controls.gameSystem.clearValidators();
    this.form.controls.tournamentId.clearValidators();
    this.form.controls.teamOneId.clearValidators();
    this.form.controls.teamTwoId.clearValidators();
    this.form.controls.teamOneCity.clearValidators();
    this.form.controls.teamTwoCity.clearValidators();
    this.form.controls.tournamentCity.clearValidators();
    this.form.controls.tournamentStartDate.clearValidators();
    this.form.controls.tournamentEndDate.clearValidators();
    this.form.controls.tournamentAddress.clearValidators();

    // Add validators based on visible fields
    this.additionalFields.forEach((field) => {
      switch (field) {
        case AdditionalFieldsEnum.TOPIC:
          this.form.controls.topic.addValidators(Validators.required);
          break;
        case AdditionalFieldsEnum.GUESTS:
          this.form.controls.guests.addValidators(Validators.required);
          break;
        case AdditionalFieldsEnum.WEAPON_TYPE:
          this.form.controls.weaponType.addValidators(Validators.required);
          break;
        case AdditionalFieldsEnum.GAME_SYSTEM:
          this.form.controls.gameSystem.addValidators(Validators.required);
          break;
        case AdditionalFieldsEnum.TOURNAMENT:
          this.form.controls.tournamentId.addValidators(Validators.required);
          if (this.showNewTournamentFields) {
            this.form.controls.tournamentCity.addValidators(
              Validators.required
            );
            this.form.controls.tournamentStartDate.addValidators(
              Validators.required
            );
            this.form.controls.tournamentEndDate.addValidators(
              Validators.required
            );
            this.form.controls.tournamentAddress.addValidators(
              Validators.required
            );
          }
          break;
        case AdditionalFieldsEnum.TEAMS:
          this.form.controls.teamOneId.addValidators([Validators.required]);
          this.form.controls.teamTwoId.addValidators([Validators.required]);
          if (this.showNewTeamOneFields) {
            this.form.controls.teamOneCity.addValidators(Validators.required);
          }
          if (this.showNewTeamTwoFields) {
            this.form.controls.teamTwoCity.addValidators(Validators.required);
          }
          break;
      }
    });

    // Update validation state
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control) {
        control.updateValueAndValidity();
      }
    });
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      this.markAllFieldsAsTouched();
      this.toastService.showError(
        'Bitte fülle alle erforderlichen Felder aus.'
      );
      return;
    }

    const formValue = this.form.getRawValue();
    if (!formValue.category) {
      this.toastService.showError('Bitte wähle eine Kategorie aus.');
      return;
    }

    const videoData: CreateVideoRequest = {
      ...formValue,
      category: formValue.category as VideoCategoriesEnum,
      weaponType: formValue.weaponType as WeaponTypesEnum | undefined,
      gameSystem: formValue.gameSystem as GameSystemTypesEnum | undefined,
    };

    this.videosDataService.create(videoData);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  public onNewChannel(): void {
    this.showNewChannelFields = true;
  }

  public onExistingChannelSelected(): void {
    this.showNewChannelFields = false;
  }

  public onNewTournament(): void {
    this.showNewTournamentFields = true;
  }

  public onExistingTournamentSelected(): void {
    this.showNewTournamentFields = false;
  }

  public onNewTeam(name: string, teamNumber: 'one' | 'two'): void {
    const existingTeam = this.teams()?.find(
      (team) => team.name.toLowerCase() === name.toLowerCase()
    );
    if (existingTeam) {
      const teamOneId = this.form.controls.teamOneId.value;
      const teamTwoId = this.form.controls.teamTwoId.value;

      if (teamOneId === existingTeam.id || teamTwoId === existingTeam.id) {
        return;
      }
    }

    if (teamNumber === 'one') {
      this.showNewTeamOneFields = true;
    } else {
      this.showNewTeamTwoFields = true;
    }
  }

  public onExistingTeamSelected(teamNumber: 'one' | 'two'): void {
    if (teamNumber === 'one') {
      this.showNewTeamOneFields = false;
    } else {
      this.showNewTeamTwoFields = false;
    }
    this.form.updateValueAndValidity();
  }

  public onMixTeamToggle(isMix: boolean, teamNumber: 'one' | 'two'): void {
    if (teamNumber === 'one') {
      this.isTeamOneMix = isMix;
      if (isMix) {
        this.form.controls.teamOneCity.setValue('Mixteam');
        this.form.controls.teamOneCity.disable();
      } else {
        this.form.controls.teamOneCity.setValue('');
        this.form.controls.teamOneCity.enable();
      }
    } else {
      this.isTeamTwoMix = isMix;
      if (isMix) {
        this.form.controls.teamTwoCity.setValue('Mixteam');
        this.form.controls.teamTwoCity.disable();
      } else {
        this.form.controls.teamTwoCity.setValue('');
        this.form.controls.teamTwoCity.enable();
      }
    }
  }

  public hasTeamValidationError(): boolean {
    return this.form.touched && this.form.hasError('sameTeam');
  }
}
