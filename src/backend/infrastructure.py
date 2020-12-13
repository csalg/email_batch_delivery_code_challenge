import boto3
import requests
from botocore.exceptions import ClientError

from controllers import IMailer, EMail
from settings import context

def _slice_and_send(email: EMail,
                    dispatch_procedure,
                    first_recipient_index,
                    max_recipients_per_query) -> int:
    """
    Utility function which splits the recipients array into several dispatches,
    to comply with external provider API limits.
    """
    recipient_slices = (email.recipients[i:i + max_recipients_per_query] \
                        for i in range(first_recipient_index, len(email.recipients), max_recipients_per_query))
    for i, recipients in enumerate(recipient_slices):
        try:
            dispatch_procedure(email.sender, recipients, email.subject, email.body)
        except:
            return i * max_recipients_per_query

    return -1

class MailgunMailer(IMailer):

    @staticmethod
    def send(email: EMail, first_recipient_index=0) -> int:
        return _slice_and_send(email,
                               MailgunMailer.__dispatch_query,
                               first_recipient_index,
                               context('MAILGUN_MAX_RECIPIENTS_PER_QUERY'))

    @staticmethod
    def __dispatch_query(sender,
                         recipients,
                         subject,
                         body):
        if len(recipients) > context('MAILGUN_MAX_RECIPIENTS_PER_QUERY'):
            raise Exception(f'Mailgun queries cannot contain more than {context("MAILGUN_MAX_RECIPIENTS_PER_QUERY")} recipients.')
        data = {
            'from': sender,
            'to': ','.join(recipients),
            'subject': subject,
            'text': body

        }
        response = requests.post(context('MAILGUN_MAX_RECIPIENTS_PER_QUERY'), data, auth=('api', ))
        response.raise_for_status()



class AmazonSESMailer(IMailer):

    @staticmethod
    def send(email: EMail, first_recipient_index=0) -> int:
        return _slice_and_send(email, AmazonSESMailer.__dispatch_query, first_recipient_index, context("AMAZON_MAX_RECIPIENTS_PER_QUERY"))

    @staticmethod
    def __dispatch_query(sender, recipients, subject, body):
        if len(recipients) > context("AMAZON_MAX_RECIPIENTS_PER_QUERY"):
            raise Exception(f'Amazon SES queries cannot contain more than {context("AMAZON_MAX_RECIPIENTS_PER_QUERY")} recipients.')

        # Create a new SES resource and specify a region.
        client = boto3.client('ses', region_name=context("AWS_REGION"))

        # Throws an error
        client.send_email(
                Destination={
                    'ToAddresses': recipients
                },
                Message={
                    'Body': {
                        'Text': {
                            'Charset': context("CHARSET"),
                            'Data': body,
                        },
                    },
                    'Subject': {
                        'Charset': context("CHARSET"),
                        'Data': subject,
                    },
                },
                Source=sender,
            )

all_mailers = MailgunMailer, AmazonSESMailer