import re
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Type

from enforce_typing import enforce_types
from flask import current_app


_valid_email_regex = re.compile('^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$')


@enforce_types
@dataclass
class EMail:
    sender : str
    recipients : List[str]
    subject : str
    body: str

    def __post_init__(self):
        if not _valid_email_regex.match(self.sender):
            raise MailSystemException(f"Sender address '{self.sender}' is incorrectly formatted!")

        if not self.recipients:
            raise MailSystemException("Recipients list is empty.")

        invalid_recipients = filter(lambda address : not _valid_email_regex.match(address), self.recipients)
        first_invalid = next(invalid_recipients, None)
        if first_invalid:
            raise MailSystemException(f"Incorrectly formatted recipient addresses found, the first one is: '{first_invalid}'")

        return self

class MailSystemException(Exception):
    pass

class IMailer(ABC):

    @abstractmethod
    def send(self, email: EMail, first_recipient_index=0) -> int:
        """
        Send submits queries to the delivery service.
        In case of an error, returns index of first non-submitted
        recipient. If all recipients are submitted successfully,
        the method returns -1.
        """
        pass

    @abstractmethod
    def get_name(self):
        """
        Returns name of the mail delivery service provider.
        E.g. Mailgun
        """
        pass



def send_email(email: EMail, mailers: List[Type[IMailer]]):
    errors = {}
    first_recipient_index = 0
    for mailer in mailers:
        try:
            current_app.logger.info(mailer.get_name())
            first_recipient_index = \
                mailer.send(email, first_recipient_index=first_recipient_index)
        except Exception as e:
            errors[mailer.get_name()] = str(e)
        if first_recipient_index == -1:
            break
    if first_recipient_index != -1:
        if errors:
            raise Exception(f"Internal server errors found:\n{errors}")
        raise Exception(f"Delivery failed before all e-mails could be sent. "
                        f"Mail was sent to only the first {first_recipient_index} recipients.")
    return


