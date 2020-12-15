from itertools import chain

import pytest
from controllers import EMail


invalid_addresses = [
    'ajfdsf',
    'fdsa,as@ssdf.com',
    'adfasd@dfds',
    'sdafd@.com',
    'ajsdf@dsaf.',
    '%fdas^@fdads.com',
    '3rwfe///'
]


def addresses_with_invalid_characters():
    invalid_address_characters = '!@#$%^&*(){}:"|<>?'
    for invalid_character in invalid_address_characters:
        for position in [3,6,-1]:
            yield valid_address[:position] + invalid_character + valid_address[position:]

valid_address = 'test@test.com'


def test_EMail():

    # Sanity check
    email = EMail(valid_address, [valid_address,], "test", "test")

    # Badly formatted sender e-mails should fail with an informative exception.
    for address in chain(invalid_addresses,addresses_with_invalid_characters()):
        with pytest.raises(ValueError, match=".*Sender.*"):
            EMail(address, [valid_address,], "test", "test")

    # Incorrectly formatted recipient addresses should fail with an informative exception
    # including the first invalid address
    for address in chain(invalid_addresses,addresses_with_invalid_characters()):
        with pytest.raises(ValueError, match=".*recipient.*"):
            EMail(valid_address, [valid_address, address,], "test", "test")


