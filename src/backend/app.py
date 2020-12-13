from flask import Flask, request, jsonify

from controllers import send_email, EMail
from infrastructure import all_mailers

app = Flask(__name__)


@app.route('/', methods=['POST'])
def email():
    form = request.json
    try:
        email = EMail(form['sender'], form['recipients'], form['subject'], form['body'])
        send_email(email, all_mailers)
    except Exception as e:
        raise ServerError(e)
    return 'ok'


class ServerError(Exception):
    pass


@app.errorhandler(ServerError)
def error(e):
    return jsonify(error=str(e)), 500
