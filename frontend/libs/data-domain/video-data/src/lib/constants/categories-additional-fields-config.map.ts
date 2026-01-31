import { CategoriesAdditionalFieldsEnum } from "../enums/categories-additional-fields.enum";
import { VideoCategoriesEnum } from "../enums/video-categories.enum";

export type CategoriesAdditionalFieldsConfig = {
  field: CategoriesAdditionalFieldsEnum;
  required: boolean;
};

export const CategoriesAdditionalFieldsConfig: Record<VideoCategoriesEnum, CategoriesAdditionalFieldsConfig[]> = {
  [VideoCategoriesEnum.REPORTS]: [
    {field: CategoriesAdditionalFieldsEnum.TOPIC, required: false}
  ],
  [VideoCategoriesEnum.HIGHLIGHTS]: [
    {field: CategoriesAdditionalFieldsEnum.TOPIC, required: false},
    {field: CategoriesAdditionalFieldsEnum.GUESTS, required: false},
    {field: CategoriesAdditionalFieldsEnum.TOURNAMENT, required: false},
  ],
  [VideoCategoriesEnum.SPARBUILDING]: [
    {field: CategoriesAdditionalFieldsEnum.WEAPON_TYPE, required: true},
    {field: CategoriesAdditionalFieldsEnum.TOPIC, required: false},
    {field: CategoriesAdditionalFieldsEnum.GUESTS, required: false},
  ],
  [VideoCategoriesEnum.MATCH]: [
    {field: CategoriesAdditionalFieldsEnum.TOURNAMENT, required: true},
    {field: CategoriesAdditionalFieldsEnum.GAME_SYSTEM, required: true},
    {field: CategoriesAdditionalFieldsEnum.TEAMS, required: true},
  ],
  [VideoCategoriesEnum.SONG]: [],
  [VideoCategoriesEnum.OTHER]: [],
  [VideoCategoriesEnum.PODCAST]: [
    {field: CategoriesAdditionalFieldsEnum.TOPIC, required: false},
    {field: CategoriesAdditionalFieldsEnum.GUESTS, required: false},
  ],
  [VideoCategoriesEnum.TRAINING]: [
    {field: CategoriesAdditionalFieldsEnum.GAME_SYSTEM, required: false},
    {field: CategoriesAdditionalFieldsEnum.WEAPON_TYPE, required: false},
    {field: CategoriesAdditionalFieldsEnum.TOPIC, required: false},
  ],
  [VideoCategoriesEnum.AWARDS]: [
    {field: CategoriesAdditionalFieldsEnum.TOURNAMENT, required: false}
  ],
};