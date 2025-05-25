from BusinessDomain.User.Repository import UserRepository
from BusinessDomain.User.Rule.tools import getJwtIdentity
from BusinessDomain.User.UseCase.QueryHandler.Query import GetUserDetailsQuery
from BusinessDomain.User.UseCase.QueryHandler.Result import GetUserDetailsResult


class GetUserDetailsQueryHandler:

    @staticmethod
    def execute(query: GetUserDetailsQuery) -> GetUserDetailsResult:

        if query.escaped_username:
            user = UserRepository.getUserByEscapedUsername(query.escaped_username)

        else:
            user = getJwtIdentity()

        return GetUserDetailsResult(
            id=user.id,
            createdAt=user.created_at,
            email=user.email,
            name=user.name,
            pictureUrl=user.picture_url,
            role=user.role,
            username=user.username,
            escaped_username=user.escaped_username,
        )
