import { FormControl } from '@angular/forms';

import { GameSystemTypesEnum, VideoCategoriesEnum, VideoFormModelFieldsEnum, WeaponTypesEnum } from '@frontend/video-data';

export type VideoFormModel = {
  [VideoFormModelFieldsEnum.NAME]: FormControl<string>;
  [VideoFormModelFieldsEnum.VIDEO_LINK]: FormControl<string>;
  [VideoFormModelFieldsEnum.CHANNEL_ID]: FormControl<number | null>;
  [VideoFormModelFieldsEnum.CHANNEL_NAME]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.CHANNEL_LINK]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.CATEGORY]: FormControl<VideoCategoriesEnum | null>;
  [VideoFormModelFieldsEnum.UPLOAD_DATE]: FormControl<string>;
  [VideoFormModelFieldsEnum.DATE_OF_RECORDING]: FormControl<string>;
  [VideoFormModelFieldsEnum.TOPIC]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.GUESTS]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.WEAPON_TYPE]: FormControl<WeaponTypesEnum | null>;
  [VideoFormModelFieldsEnum.GAME_SYSTEM]: FormControl<GameSystemTypesEnum | null>;
  [VideoFormModelFieldsEnum.TOURNAMENT_ID]: FormControl<number | null>;
  [VideoFormModelFieldsEnum.TOURNAMENT_NAME]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TOURNAMENT_CITY]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TOURNAMENT_START_DATE]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TOURNAMENT_END_DATE]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TEAM_ONE_ID]: FormControl<number | null>;
  [VideoFormModelFieldsEnum.TEAM_ONE_NAME]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TEAM_ONE_CITY]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TEAM_ONE_MIX]: FormControl<boolean | null>;
  [VideoFormModelFieldsEnum.TEAM_TWO_ID]: FormControl<number | null>;
  [VideoFormModelFieldsEnum.TEAM_TWO_NAME]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TEAM_TWO_CITY]: FormControl<string | null>;
  [VideoFormModelFieldsEnum.TEAM_TWO_MIX]: FormControl<boolean | null>;
  [VideoFormModelFieldsEnum.COMMENT]: FormControl<string | null>;
};