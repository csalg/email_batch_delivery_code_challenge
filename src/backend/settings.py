import os

from immutabledict import immutabledict

__environment_variables = [
    "CHARSET",
    "AWS_DEFAULT_REGION",
    "MAILGUN_ENDPOINT",
    "MAILGUN_SECRET"
]

__environment_variables_int = [
    "AWS_MAX_RECIPIENTS_PER_QUERY",
    "MAILGUN_MAX_RECIPIENTS_PER_QUERY",
]

def __create_context():
    env = {}
    for key in __environment_variables:
        env[key] = os.environ[key]
    for key in __environment_variables_int:
        env[key] = int(os.environ[key])
    return immutabledict(env)

context = __create_context()