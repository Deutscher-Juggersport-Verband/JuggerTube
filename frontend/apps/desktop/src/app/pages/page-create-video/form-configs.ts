import {
  NewOptionRawConfig,
  UiInputDirectionEnum,
  UiInputTypeEnum,
} from '../../ui-shared';

export const channelNewOptionConfig: NewOptionRawConfig = {
  labelText:
    'Dieser Channel ist uns noch nicht bekannt. Um den Channel bei uns zu registrieren, gib uns bitte folgende Daten:',
  fields: [
    {
      labelText: 'Channellink:',
      type: UiInputTypeEnum.TEXT,
      formControlElement: 'channelLink',
      direction: UiInputDirectionEnum.ROW,
    },
  ],
};

export const tournamentNewOptionConfig: NewOptionRawConfig = {
  labelText:
    'Dieses Turnier ist uns noch nicht bekannt. Um das Turnier bei uns zu registrieren, gib uns bitte folgende Daten:',
  fields: [
    {
      labelText: 'Stadt:',
      type: UiInputTypeEnum.TEXT,
      formControlElement: 'tournamentCity',
      direction: UiInputDirectionEnum.ROW,
    },
    {
      labelText: 'Startdatum:',
      type: UiInputTypeEnum.DATE,
      formControlElement: 'tournamentStartDate',
      direction: UiInputDirectionEnum.ROW,
    },
    {
      labelText: 'Enddatum:',
      type: UiInputTypeEnum.DATE,
      formControlElement: 'tournamentEndDate',
      direction: UiInputDirectionEnum.ROW,
    },
    {
      labelText: 'Adresse:',
      type: UiInputTypeEnum.TEXT,
      formControlElement: 'tournamentAddress',
      direction: UiInputDirectionEnum.ROW,
    },
  ],
};

export const teamOneNewOptionConfig: NewOptionRawConfig = {
  labelText:
    'Das Team kennen wir noch nicht. Um das Team als neues Team bei uns zu hinterlegen, gib uns bitte folgende Daten:',
  fields: [
    {
      labelText: 'Stadt:',
      type: UiInputTypeEnum.TEXT,
      formControlElement: 'teamOneCity',
      direction: UiInputDirectionEnum.ROW,
    },
    {
      labelText: 'Mixteam?:',
      type: UiInputTypeEnum.TOGGLE,
      formControlElement: 'teamOneMix',
      direction: UiInputDirectionEnum.ROW,
    },
  ],
};

export const teamTwoNewOptionConfig: NewOptionRawConfig = {
  labelText:
    'Das Team kennen wir noch nicht. Um das Team als neues Team bei uns zu hinterlegen, gib uns bitte folgende Daten:',
  fields: [
    {
      labelText: 'Stadt:',
      type: UiInputTypeEnum.TEXT,
      formControlElement: 'teamTwoCity',
      direction: UiInputDirectionEnum.ROW,
    },
    {
      labelText: 'Mixteam?:',
      type: UiInputTypeEnum.TOGGLE,
      formControlElement: 'teamTwoMix',
      direction: UiInputDirectionEnum.ROW,
    },
  ],
};
