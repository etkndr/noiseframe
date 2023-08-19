from app.models import db
from app.models import Song, Track
from app.forms import TrackForm
from flask import Blueprint, request
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

track_routes = Blueprint("track", __name__)

# GET TRACK BY ID
@track_routes.route("/<int:id>")
def get_track(id):
    track = Track.query.get(id)
    
    if not track:
        return {"errors": "Track not found"}, 404
    
    return track.to_dict()

# SAVE TRACK EDITS
@track_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_track(id, song_id):
    track = Track.query.get(id)
    if not track:
        return {"errors": "Track not found"}, 404
    
    form = TrackForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    song = Song.query.get(song_id)
    if not song:
        return {"errors": "Song not found"}, 404
    if song.user_id != current_user.id:
        return {"errors": "Tracks can only be edited by song creator"}, 400
    
    if form.validate_on_submit():
        track.instrument_id = form.instrument_id
        track.title = form.title
        track.notes = form.notes
        track.volume = form.volume

        db.session.commit()
        
        return track.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# DELETE TRACK
@track_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_track(id):
    track = Track.query.get(id)
    if not track:
        return {"errors": "Track not found"}, 404
    
    song = Song.query.get(track.song_id)
    if song.user_id != current_user.id:
        return {"errors": "Tracks can only be deleted by their creator"}, 400
    
    db.session.delete(track)
    
    return {"message": "Track successfully deleted"}