from flask import Blueprint, request
from app.models import instrument

instrument_routes = Blueprint("instrument", __name__)