import { GameSystemTypesEnum } from "../enums/game-system-types.enum";
import { VideoCategoriesEnum } from "../enums/video-categories.enum";
import { WeaponTypesEnum } from "../enums/weapon-types.enum";

export interface CreateVideoRequestModel {
  name: string;
  videoLink: string;
  category: VideoCategoriesEnum;
  uploadDate: string;
  dateOfRecording: string;
  topic?: string;
  guests?: string;
  weaponType?: WeaponTypesEnum | null;
  gameSystem?: GameSystemTypesEnum | null;
  channelId?: number;
  channelName?: string;
  channelLink?: string;
  tournamentId?: number;
  tournamentName?: string;
  tournamentCity?: string;
  tournamentStartDate?: string;
  tournamentEndDate?: string;
  teamOneId?: number;
  teamOneName?: string;
  teamOneCity?: string;
  teamTwoId?: number;
  teamTwoName?: string;
  teamTwoCity?: string;
  comment?: string;
}