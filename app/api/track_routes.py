from flask import Blueprint, request
from app.models import track

track_routes = Blueprint("track", __name__)