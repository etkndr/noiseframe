from app.models import db, Instrument, Sample, Song, Track
from app.forms import InstrumentForm, SampleForm
from flask import Blueprint, request
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages
from app.api.aws_helpers import (
    upload_file_to_s3, get_unique_filename)

instrument_routes = Blueprint("instrument", __name__)

# HELPER TO SHOW SAMPLES FOR INSTRUMENT
def inst_samples(inst):
    samples = Sample.query.filter(Sample.instrument_id == inst.id).all()
    inst_dict = inst.to_dict()
    samples_dict = [sample.to_dict() for sample in samples]
    inst_dict["Samples"] = samples_dict
    return inst_dict

# GET USER INSTRUMENTS
@instrument_routes.route("/")
@login_required
def user_inst():
    instruments = Instrument.query.filter(Instrument.user_id == current_user.id).all()
    
    return {"instruments": [inst.to_dict() for inst in instruments]}

# GET INSTRUMENT BY ID
@instrument_routes.route("/<int:id>")
def get_inst(id):
    instrument = Instrument.query.get(id)
    if not instrument:
        return {"errors": "Instrument not found"}, 404
    
    inst = instrument.to_dict()
    samples = inst_samples(instrument)
    
    return samples

# SAVE NEW INSTRUMENT
@instrument_routes.route("/", methods=["POST"])
@login_required
def new_inst():
    form = InstrumentForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    if form.validate_on_submit():
        inst = Instrument(
            user_id = current_user.id,
            title = form.data["title"],
            type = form.data["type"],
            osc = form.data["osc"],
            env = form.data["env"]
        )
        
        db.session.add(inst)
        db.session.commit()
        
        return inst.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# SAVE INSTRUMENT CHANGES
@instrument_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_inst(id):
    form = InstrumentForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    
    inst = Instrument.query.get(id)
    if not inst:
        return {"errors": "Instrument not found"}, 404
    if inst.user_id != current_user.id:
        return {"errors": "Instruments can only be edited by creator"}, 400

    if form.validate_on_submit():
        inst.user_id = current_user.id
        inst.title = form.data["title"]
        inst.type = form.data["type"]
        inst.osc = form.data["osc"]
        inst.env = form.data["env"]
        
        db.session.commit()
        
        return inst.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401

# DELETE INSTRUMENT
@instrument_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_inst(id):
    inst = Instrument.query.get(id)  
    if not inst:
        return {"errors": "Instrument not found"}, 404
    if inst.user_id != current_user.id:
        return {"errors": "Instruments can only be deleted by creator"}, 400
    
    songs = Song.query.filter(Song.instrument_id == inst.id).all()
    for song in songs:
        tracks = Track.query.filter(Track.song_id == song.id).all()
        for track in tracks:
            db.session.delete(track)
            db.session.commit()
        db.session.delete(song)
        db.session.commit()

    db.session.delete(inst)
    db.session.commit()
    
    return {"message": "Instrument successfully deleted"}

# UPLOAD SAMPLE FOR INSTRUMENT
@instrument_routes.route("/<int:id>/samples", methods=["POST"])
@login_required
def upload_sample(id):
    form = SampleForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
 
    if form.validate_on_submit():
          
        sample = form.data["sample"]
        sample.filename = get_unique_filename(sample.filename)
        upload = upload_file_to_s3(sample)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
            return {"errors": upload}, 401

        name = form.data["name"]
        url = upload["url"]
        new_sample = Sample(instrument_id=id, name=name, url=url)
        db.session.add(new_sample)
        db.session.commit()
        
        songs = Song.query.filter(Song.instrument_id == id).all()
        
        for song in songs:
            track = Track(
                song_id = song.id,
                sample_id = new_sample.id,
                steps = "null null null null null null null null null null null null null null null null",
                volume = -3  
            )
            
            db.session.add(track)
            db.session.commit()

        return new_sample.to_dict()

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401
    
# GET ALL SAMPLES FOR INSTRUMENT
@instrument_routes.route("/<int:id>/samples")
def get_samples(id):
    samples = Sample.query.filter(Sample.instrument_id == id).all()
    
    inst = Instrument.query.get(id)  
    if not inst:
        return {"errors": "Instrument not found"}, 404
    
    return [sample.to_dict() for sample in samples]