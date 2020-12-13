from flask import Flask, request, jsonify

from controllers import send_email, EMail
from infrastructure import all_mailers

app = Flask(__name__)

@app.errorhandler(400)
def resource_not_found(e):
    return jsonify(error=str(e)), 400

@app.route('/')
def email():
    form = request.json
    try:
        email = EMail(form['sender'], form['recipients'], form['subject'], form['body'])
        send_email(email, all_mailers)
    except Exception as e:
        return 'not ok'
    return 'ok'


