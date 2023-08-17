from flask import Blueprint, request
from app.models import song

song_routes = Blueprint("song", __name__)