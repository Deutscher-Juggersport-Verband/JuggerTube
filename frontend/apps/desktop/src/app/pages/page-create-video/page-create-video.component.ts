
import { Component, inject, Signal } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  initConfig,
  UiAutocompleteInputComponent,
  UiButtonColorEnum,
  UiButtonComponent,
  UiInputComponent,
  UiInputDirectionEnum,
  UiInputTypeEnum,
} from '../../ui-shared';
import { markAllFieldsAsTouched } from '../../utils/form-utils';
import {
  channelNewOptionConfig,
  teamOneNewOptionConfig,
  teamTwoNewOptionConfig,
  tournamentNewOptionConfig,
} from './form-configs';
import { ChannelsDataService } from '@frontend/channel';
import { ChannelApiResponseModel } from '@frontend/channel-data';
import { TeamsDataService } from '@frontend/team';
import { TeamApiResponseModel } from '@frontend/team-data';
import { TournamentsDataService } from '@frontend/tournament';
import { TournamentApiResponseModel } from '@frontend/tournament-data';
import {
  ToastService,
  VideoFormModel,
  VideoFormService,
  VideosDataService,
} from '@frontend/video';
import {
  CategoriesAdditionalFieldsConfig,
  CategoriesAdditionalFieldsEnum,
  CreateNewObjectTypesEnum,
  CreateVideoRequest,
  GameSystemTypesEnum,
  VideoCategoriesEnum,
  WeaponTypesEnum,
} from '@frontend/video-data';

@Component({
  imports: [
    FormsModule,
    UiButtonComponent,
    UiInputComponent,
    UiAutocompleteInputComponent,
    ReactiveFormsModule
],
  standalone: true,
  templateUrl: './page-create-video.component.html',
  styleUrl: './page-create-video.component.less',
})
export class PageCreateVideoComponent {
  private readonly tournamentService: TournamentsDataService = inject(
    TournamentsDataService
  );
  private readonly teamService: TeamsDataService = inject(TeamsDataService);
  private readonly channelsDataService: ChannelsDataService =
    inject(ChannelsDataService);
  private readonly videoFormService: VideoFormService =
    inject(VideoFormService);
  private readonly videosDataService: VideosDataService =
    inject(VideosDataService);
  private readonly toastService: ToastService = inject(ToastService);

  public teams: Signal<TeamApiResponseModel[]> = this.teamService.getTeams();
  public tournaments: Signal<TournamentApiResponseModel[]> =
    this.tournamentService.getTournaments();
  public channels: Signal<ChannelApiResponseModel[]> =
    this.channelsDataService.getChannels();

  protected readonly form: FormGroup<VideoFormModel> =
    this.videoFormService.create();
  protected categoriesAdditionalFieldsConfig: Signal<CategoriesAdditionalFieldsConfig[]> =
    this.videoFormService.categoriesAdditionalFieldsConfig;

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;
  protected readonly UiInputDirectionEnum = UiInputDirectionEnum;

  protected readonly Object = Object;
  protected readonly VideoCategoriesEnum = VideoCategoriesEnum;
  protected readonly WeaponTypesEnum = WeaponTypesEnum;
  protected readonly GameSystemTypesEnum = GameSystemTypesEnum;
  protected readonly CategoriesAdditionalFieldsEnum = CategoriesAdditionalFieldsEnum;
  protected readonly CreateNewObjectTypesEnum = CreateNewObjectTypesEnum;

  protected readonly channelNewOptionConfig = channelNewOptionConfig;
  protected readonly tournamentNewOptionConfig = tournamentNewOptionConfig;
  protected readonly teamOneNewOptionConfig = teamOneNewOptionConfig;
  protected readonly teamTwoNewOptionConfig = teamTwoNewOptionConfig;
  protected readonly initConfig = initConfig;

  public logFormErrors(
  form: FormGroup | FormArray,
  path: string = ''
  ): void {
    Object.entries(form.controls).forEach(([key, control]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logFormErrors(control, currentPath);
      } else if (control.invalid) {
        console.log('❌ INVALID:', currentPath);
        console.log('   status:', control.status);
        console.log('   errors:', control.errors);
        console.log('   value:', control.value);
      }
    });
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      console.log(this.form.status);
      this.logFormErrors(this.form);
      markAllFieldsAsTouched(this.form);
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

    console.log('Form Value 1:', formValue);

    this.videosDataService.create(formValue as CreateVideoRequest);
  }

  public sameTeamValidationError(): boolean {
    return this.form.touched && this.form.hasError('sameTeam');
  }
}
