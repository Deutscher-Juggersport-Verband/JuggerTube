from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash

from BusinessDomain.User.Repository import UserRepository
from BusinessDomain.User.Rule import (
    CreateOrIncreaseLoginAttemptsRule,
    IncreaseFailedAttemptsRule,
    IsUserLockedRule,
)
from BusinessDomain.User.UseCase.CommandHandler.Command import LoginUserCommand
from BusinessDomain.User.UseCase.CommandHandler.Result import LoginUserResult
from DataDomain.Database.Enum import LockType
from Infrastructure.Mail.User import SendUserLockedMail


class LoginUserCommandHandler:

    @staticmethod
    def execute(command: LoginUserCommand) -> LoginUserResult | bool:

        user = UserRepository.getUserByUsernameOrEmail(
            username=command.username,
            email=command.email
        )

        is_locked, lock_type, locked_until = IsUserLockedRule.applies(
            user.username)

        if is_locked:
            if lock_type == LockType.TEMPORARILY.value:
                IncreaseFailedAttemptsRule.applies(user.username)

            return LoginUserResult(
                lockType=lock_type,
                lockedUntil=locked_until
            )

        if check_password_hash(user.password_hash, command.password):
            access_token = create_access_token(
                identity=user.id
            )

            return LoginUserResult(
                token=access_token,
                language=user.language
            )

        current_attempts = CreateOrIncreaseLoginAttemptsRule.applies(
            user.username)

        if current_attempts >= 8:
            user = UserRepository.getUserByUsername(user.username)

            SendUserLockedMail().send(user)
