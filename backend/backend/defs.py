import os

from dotenv import load_dotenv
from firebase_admin import credentials

load_dotenv()

CREDENTIALS = credentials.Certificate(
    {
        "type": "service_account",
        "project_id": "puzzlepieces-25386",
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY"),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
    }
)

BUCKET_BASE_URL = "https://storage.googleapis.com/puzzlepieces-25386.appspot.com"

FILEPATH_NAMES = {
    "airplane": "airplane.png",
    "baboon": "baboon.png",
    "cat": "cat.png",
    "peppers": "peppers.png",
    "pool": "pool.png",
    "arch": "arch.jpg",
    "pattern": "pattern.jpg",
    "building": "building.jpg",
    "leaves": "leaves.jpg",
    "flower": "flower.jpg",
}
