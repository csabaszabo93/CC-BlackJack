from flask import Flask , render_template, redirect, url_for, request, abort, session, make_response

app = Flask(__name__)


@app.route('/')
def index():
    pass


if __name__ == '__main__':
    app.secret_key = os.urandom(16)
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )
