from app.models import db
from app.models import Song, Track
from app.forms import SongForm, TrackForm
from flask import Blueprint, request
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

song_routes = Blueprint("song", __name__)

# GET SONGS FOR CURRENT USER
@song_routes.route("/")
@login_required
def get_user_songs():
    songs = Song.query.filter(Song.user_id == current_user.id).all()
    return {"user_songs": [song.to_dict() for song in songs]}

# GET SONG BY ID
@song_routes.route("/<int:id>")
@login_required
def get_one_song(id):
    song = Song.query.get(id)
    
    if not song:
        return {"errors": "Song not found"}, 404

    return song.to_dict()

# SAVE NEW SONG
@song_routes.route("/", methods=["POST"])
@login_required
def new_song():
    form = SongForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    if form.validate_on_submit():
        song = Song(
            user_id = current_user.id,
            instrument_id = form.data["instrument_id"],
            title = form.data["title"],
            bpm = form.data["bpm"]    
        )
        
        db.session.add(song)
        db.session.commit()
        
        return song.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# SAVE EDITS TO SONG
@song_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_song(id):
    song = Song.query.get(id)
    
    if not song:
        return {"errors": "Song not found"}, 404
    
    if song.user_id != current_user.id:
        return {"errors": "Songs can only be edited by their creator"}, 400
    
    form = SongForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        song.user_id = current_user.id
        song.instrument_id = form.data["instrument_id"]
        song.title = form.data["title"]
        song.bpm = form.data["bpm"] 
        
        db.session.commit()
        
        return song.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# DELETE SONG
@song_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_song(id):
    song = Song.query.get(id)

    if not song:
        return {"errors": "Song not found"}, 404
    
    if song.user_id != current_user.id:
        return {"errors": "Songs can only be deleted by their creator"}, 400
    
    db.session.delete(song)
    db.session.commit()
    return {"message": "Song successfully deleted"}

# GET TRACKS FOR CURRENT SONG
@song_routes.route("/<int:id>/tracks")
def song_tracks(id):
    song = Song.query.get(id)
    
    if not song:
        return {"errors": "Song not found"}, 404
    
    tracks = Track.query.filter(Track.song_id == id).all()
    
    return {"tracks": [track.to_dict() for track in tracks]}

# SAVE NEW TRACK
@song_routes.route("/<int:id>/tracks", methods=["POST"])
@login_required
def new_track(id):
    form = TrackForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    song = Song.query.get(id)
    if not song:
        return {"errors": "Song not found"}, 404
    if song.user_id != current_user.id:
        return {"errors": "Tracks can only be added by song creator"}, 400
    
    if form.validate_on_submit():
        track = Track(
            song_id = id,
            sample_id = form.data["sample_id"],
            steps = form.data["steps"],
            volume = form.data["volume"]
        )

        db.session.add(track)
        db.session.commit()
        
        return track.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401