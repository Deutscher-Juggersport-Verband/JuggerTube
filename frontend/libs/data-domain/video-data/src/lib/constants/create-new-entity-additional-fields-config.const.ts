import { CreateNewEntityTypesEnum } from "../enums/create-new-entity-types.enum";
import { VideoFormModelFieldsEnum } from "../enums/video-form-model-fields.enum";

export type CreateNewEntityAdditionalFieldsConfigType = {
  [key in CreateNewEntityTypesEnum]: VideoFormModelFieldsEnum[];
};

export const CreateNewEntityAdditionalFieldsConfig: CreateNewEntityAdditionalFieldsConfigType = {
  [CreateNewEntityTypesEnum.CHANNEL]: [
    VideoFormModelFieldsEnum.CHANNEL_NAME,
    VideoFormModelFieldsEnum.CHANNEL_LINK,
  ],
  [CreateNewEntityTypesEnum.TEAM_ONE]: [
    VideoFormModelFieldsEnum.TEAM_ONE_NAME,
    VideoFormModelFieldsEnum.TEAM_ONE_CITY,
    VideoFormModelFieldsEnum.TEAM_ONE_MIX,
  ],
  [CreateNewEntityTypesEnum.TEAM_TWO]: [
    VideoFormModelFieldsEnum.TEAM_TWO_NAME,
    VideoFormModelFieldsEnum.TEAM_TWO_CITY,
    VideoFormModelFieldsEnum.TEAM_TWO_MIX,
  ],
  [CreateNewEntityTypesEnum.TOURNAMENT]: [
    VideoFormModelFieldsEnum.TOURNAMENT_NAME,
    VideoFormModelFieldsEnum.TOURNAMENT_CITY,
    VideoFormModelFieldsEnum.TOURNAMENT_START_DATE,
    VideoFormModelFieldsEnum.TOURNAMENT_END_DATE,
  ],
};

export const EntityIdFieldMap: {
  [key in CreateNewEntityTypesEnum]: VideoFormModelFieldsEnum;
} = {
  [CreateNewEntityTypesEnum.CHANNEL]: VideoFormModelFieldsEnum.CHANNEL_ID,
  [CreateNewEntityTypesEnum.TEAM_ONE]: VideoFormModelFieldsEnum.TEAM_ONE_ID,
  [CreateNewEntityTypesEnum.TEAM_TWO]: VideoFormModelFieldsEnum.TEAM_TWO_ID,
  [CreateNewEntityTypesEnum.TOURNAMENT]: VideoFormModelFieldsEnum.TOURNAMENT_ID,
};