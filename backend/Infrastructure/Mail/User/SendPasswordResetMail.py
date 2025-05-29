from DataDomain.Database.Model import Users
from Infrastructure.Mail import SendSingleMail


class SendPasswordResetMail:
    """Email a user about a password reset request."""

    def send(self, user: Users, hash: str) -> None:
        email_body = self.create_email_body(user, hash)

        SendSingleMail.send(
            subject='Reset password',
            recipients=[user.email],
            body=email_body
        )

    @staticmethod
    def create_email_body(user: Users, hash: str) -> str:
        # TODO: Create email template
        return 'Funktion noch implementieren'
