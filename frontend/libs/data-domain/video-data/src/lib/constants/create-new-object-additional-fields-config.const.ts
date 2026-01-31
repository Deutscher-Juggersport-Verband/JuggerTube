import { CreateNewObjectTypesEnum } from "../enums/create-new-object-types.enum";
import { VideoFormModelFieldsEnum } from "../enums/video-form-model-fields.enum";

export type CreateNewObjectsAdditionalFieldsConfigType = {
  [key in CreateNewObjectTypesEnum]: VideoFormModelFieldsEnum[];
};

export const CreateNewObjectsAdditionalFieldsConfig: CreateNewObjectsAdditionalFieldsConfigType = {
  [CreateNewObjectTypesEnum.CHANNEL]: [
    VideoFormModelFieldsEnum.CHANNEL_NAME,
    VideoFormModelFieldsEnum.CHANNEL_LINK,
  ],
  [CreateNewObjectTypesEnum.TEAM_ONE]: [
    VideoFormModelFieldsEnum.TEAM_ONE_NAME,
    VideoFormModelFieldsEnum.TEAM_ONE_CITY,
    VideoFormModelFieldsEnum.TEAM_ONE_MIX,
  ],
  [CreateNewObjectTypesEnum.TEAM_TWO]: [
    VideoFormModelFieldsEnum.TEAM_TWO_NAME,
    VideoFormModelFieldsEnum.TEAM_TWO_CITY,
    VideoFormModelFieldsEnum.TEAM_TWO_MIX,
  ],
  [CreateNewObjectTypesEnum.TOURNAMENT]: [
    VideoFormModelFieldsEnum.TOURNAMENT_NAME,
    VideoFormModelFieldsEnum.TOURNAMENT_CITY,
    VideoFormModelFieldsEnum.TOURNAMENT_START_DATE,
    VideoFormModelFieldsEnum.TOURNAMENT_END_DATE,
  ],
};

export const ObjectsIdFieldMap: {
  [key in CreateNewObjectTypesEnum]: VideoFormModelFieldsEnum;
} = {
  [CreateNewObjectTypesEnum.CHANNEL]: VideoFormModelFieldsEnum.CHANNEL_ID,
  [CreateNewObjectTypesEnum.TEAM_ONE]: VideoFormModelFieldsEnum.TEAM_ONE_ID,
  [CreateNewObjectTypesEnum.TEAM_TWO]: VideoFormModelFieldsEnum.TEAM_TWO_ID,
  [CreateNewObjectTypesEnum.TOURNAMENT]: VideoFormModelFieldsEnum.TOURNAMENT_ID,
};