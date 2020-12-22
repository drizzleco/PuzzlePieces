import os
import random

import firebase_admin
from firebase_admin import firestore, storage
from flask import Flask, request
from image_slicer import calc_columns_rows

from backend.defs import BUCKET_BASE_URL, CREDENTIALS, FILEPATH_NAMES
from backend.utils import slice_images

app = Flask(__name__)


firebase_app = firebase_admin.initialize_app(
    CREDENTIALS, options={"storageBucket": "puzzlepieces-25386.appspot.com"},
)
db = firestore.client()
bucket = storage.bucket(app=firebase_app)


@app.route("/")
def hello_world():
    return "Don't use this", 200


@app.route("/start-game")
def start_game():
    game_id = request.args.get("id")
    game_object = db.collection("game").document(game_id)
    game_data = game_object.get()
    if not game_data.exists:
        return "Game data does not exist", 404
    name = random.choice(list(FILEPATH_NAMES.keys()))

    # delegate random image to each player
    players = db.collection("game").document(game_id).collection("players")
    num_players = len(list(players.get()))
    if not bucket.blob(f"splits/{name}/{num_players}/0.png").exists():
        slice_images(bucket=bucket, name=name, num_split=num_players)

    for index, player in enumerate(players.stream()):
        player_object = (
            db.collection("game")
            .document(game_id)
            .collection("players")
            .document(player.id)
        )
        player_object.update(
            {"imageLink": f"{BUCKET_BASE_URL}/splits/{name}/{num_players}/{index}.png"}
        )

    columns, rows = calc_columns_rows(num_players)

    # update game state and save boss image
    game_object.update(
        {
            "state": "ROUND",
            "bossImageLink": f"{BUCKET_BASE_URL}/boss images/{name}.png",
            "rows": rows,
            "columns": columns,
        }
    )
    return "Success!", 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
