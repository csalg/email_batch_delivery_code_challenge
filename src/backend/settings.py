import os

from immutabledict import immutabledict

__environment_variables = [
    "AWS_REGION",
    "CHARSET",
    "AMAZON_MAX_RECIPIENTS_PER_QUERY",
    "MAILGUN_MAX_RECIPIENTS_PER_QUERY",
    "MAILGUN_ENDPOINT"
]
def __create_context():
    env = {}
    for key in __environment_variables:
        env[key] = os.environ[key]
    return immutabledict(env)

context = __create_context()