from flask import Flask, request
from image_slicer import slice

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/image-slicer")
def image_slicer():
    image_url = (
        request.args.get("url")
        or "https://storage.googleapis.com/puzzlepieces-25386.appspot.com/boss%20images/airplane.png"
    )
    if not image_url:
        return "No query param image_url provided"
    # TODO: Download file from google storage -> write to NamedTemporaryFile
    # list_of_file_names = slice("backend/airplane.png", 5)

    # boss_images/airplane.png
    # CONDITIONAL splits/airplane/4/

    # TODO:
    # 1. Go through each list of file names.
    # 2. Rename them to the pieces that you want (airplane/1.png, airplane/2.png)
    # 3. Write a metadata file to firestorage.
    return image_url


# https://puzzlepieces-25386.web.app/airplane.png
# https://storage.googleapis.com/puzzlepieces-25386.appspot.com/boss%20images/airplane.png

