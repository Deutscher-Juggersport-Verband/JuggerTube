import { VideoCreationErrorTypesEnum } from '@frontend/video-data';

export const VideoCreationErrorMessagesConstants = {
    [VideoCreationErrorTypesEnum.NAME_ALREADY_EXISTS]: 'Ein Video mit diesem Namen existiert bereits',
    [VideoCreationErrorTypesEnum.LINK_ALREADY_EXISTS]: 'Ein Video mit diesem Link existiert bereits',
    [VideoCreationErrorTypesEnum.DEFAULT]: 'Video konnte nicht erstellt werden',
} as const;