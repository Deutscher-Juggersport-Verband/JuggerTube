from DataDomain.Database.Model import Users
from Infrastructure.Mail import SendSingleMail


class SendPasswordResetSuccessMail:
    """Email a user about a password reset success."""

    def send(self, user: Users) -> None:
        email_body = self.create_email_body(user)

        SendSingleMail.send(
            subject='Reset password success',
            recipients=[user.email],
            body=email_body
        )

    @staticmethod
    def create_email_body(user: Users) -> str:
        # TODO: Create email template
        return 'Funktion noch implementieren'
