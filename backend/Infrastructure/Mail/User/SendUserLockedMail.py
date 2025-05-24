from DataDomain.Database.Model import Users
from Infrastructure.Mail import SendSingleMail


class SendUserLockedMail:
    """Class to send a mail to a user that his account is locked"""

    def send(self, user: Users) -> None:
        email_body = self.create_email_body(user)

        SendSingleMail.send(
            subject='Your account has been locked',
            recipients=[user.email],
            body=email_body
        )

    @staticmethod
    def create_email_body(user: Users) -> str:
        # TODO: Create email template
        return 'Funktion noch implementieren'
