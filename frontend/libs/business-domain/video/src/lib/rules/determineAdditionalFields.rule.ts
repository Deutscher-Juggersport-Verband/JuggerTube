import { AdditionalFieldsEnum } from '@frontend/video';
import { VideoCategoriesEnum } from '@frontend/video-data';

export function determineAdditionalFieldsRule(
  value: VideoCategoriesEnum
): AdditionalFieldsEnum[] {
  switch (value) {
    case VideoCategoriesEnum.REPORTS:
      return [AdditionalFieldsEnum.TOPIC];
    case VideoCategoriesEnum.HIGHLIGHTS:
      return [
        AdditionalFieldsEnum.TOPIC,
        AdditionalFieldsEnum.GUESTS,
        AdditionalFieldsEnum.TOURNAMENT,
      ];
    case VideoCategoriesEnum.SPARBUILDING:
      return [
        AdditionalFieldsEnum.WEAPON_TYPE,
        AdditionalFieldsEnum.TOPIC,
        AdditionalFieldsEnum.GUESTS,
      ];
    case VideoCategoriesEnum.MATCH:
      return [
        AdditionalFieldsEnum.TOURNAMENT,
        AdditionalFieldsEnum.GAME_SYSTEM,
        AdditionalFieldsEnum.TEAMS,
      ];
    case VideoCategoriesEnum.OTHER:
    case VideoCategoriesEnum.PODCAST:
      return [AdditionalFieldsEnum.TOPIC, AdditionalFieldsEnum.GUESTS];
    case VideoCategoriesEnum.TRAINING:
      return [
        AdditionalFieldsEnum.GAME_SYSTEM,
        AdditionalFieldsEnum.WEAPON_TYPE,
        AdditionalFieldsEnum.TOPIC,
      ];
    case VideoCategoriesEnum.AWARDS:
      return [AdditionalFieldsEnum.TOURNAMENT];
    default:
      return [];
  }
}
