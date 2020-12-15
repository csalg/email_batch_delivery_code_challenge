from flask import Flask, request, jsonify, current_app
from flask_cors import CORS

import controllers
from controllers import EMail
from infrastructure import all_mailers

app = Flask(__name__)
CORS(app, resources=r'*')


@app.route('/', methods=['POST'])
def send_email():
    form = request.json
    try:
        email = EMail(form['sender'], form['recipients'], form['subject'], form['body'])
        current_app.logger.info(email)
        controllers.send_email(email, all_mailers)
    except Exception as e:
        raise ServerError(e)
    return server_success()


class ServerError(Exception):
    def to_json(self):
        data = {'status': 'error', 'message': str(self) }
        return jsonify(**data)


@app.errorhandler(ServerError)
def error(error):
    return error.to_json(), 500


def server_success(message=""):
    data = {'status': 'ok', 'message': message}
    return jsonify(**data)


