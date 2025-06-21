from DataDomain.Database.Model import Users


class DoesUserExistsRule:

    @staticmethod
    def applies(
            user_id: int | None = None,
            escaped_username: str | None = None,
            email: str | None = None) -> bool:

        if user_id is None and escaped_username is None and email is None:
            return False

        return Users().exists(
            id=user_id,
            escaped_username=escaped_username,
            email=email
        )
