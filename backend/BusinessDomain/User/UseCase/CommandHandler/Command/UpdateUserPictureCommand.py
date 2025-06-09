from dataclasses import dataclass


@dataclass
class UpdateUserPictureCommand:

    user_id: int
    picture_data: str
