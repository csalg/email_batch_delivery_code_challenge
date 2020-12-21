from flask import Flask, request, jsonify, current_app
from flask_cors import CORS

import controllers
from controllers import EMail
from infrastructure import all_mailers


app = Flask(__name__)
CORS(app, resources=r'*')
mailers = [mailer() for mailer in all_mailers]


@app.route('/', methods=['POST'])
def send_email():
    form = request.json
    try:
        email = EMail(form['sender'], form['recipients'], form['subject'], form['body'])
        current_app.logger.info("E-mail delivery request received:", email)
        controllers.send_email(email, mailers)
    except controllers.MailSystemException as e:
        raise e
    except Exception as e:
        current_app.logger.exception(e)
        raise ServerError(e)
    return server_success()


class ServerError(Exception):
    pass


@app.errorhandler(ServerError)
def error(error):
    return "Internal server error", 500


@app.errorhandler(controllers.MailSystemException)
def error(error):
    payload = {'status': 'error', 'message': str(error)}
    return jsonify(**payload), 500


def server_success(message=""):
    data = {'status': 'ok', 'message': message}
    return jsonify(**data)


