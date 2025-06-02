import { GameSystemTypesEnum } from '../enums/game-system-types.enum';
import { VideoCategoriesEnum } from '../enums/video-categories.enum';
import { WeaponTypesEnum } from '../enums/weapon-types.enum';
import { UserShort } from '@frontend/user-data';

interface Channel {
  name: string;
  link: string;
}

interface Tournament {
  name: string;
  city: string;
  startDate: Date;
  endDate: Date;
  jtrLink: string;
}

interface Team {
  name: string;
  city: string;
}

export interface PendingVideo {
  id: number;
  name: string;
  category: VideoCategoriesEnum;
  videoLink: string;
  uploadDate: Date;
  comment: string;
  dateOfRecording?: Date;
  gameSystem?: GameSystemTypesEnum;
  weaponType?: WeaponTypesEnum;
  topic: string;
  guests: string;
  channel: Channel;
  tournament?: Tournament;
  teamOne?: Team;
  teamTwo?: Team;
  user: UserShort;
}
