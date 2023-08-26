from app.models import db
from app.models import Instrument
from app.forms import InstrumentForm
from flask import Blueprint, request
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

instrument_routes = Blueprint("instrument", __name__)

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
    
    return instrument.to_dict()

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
            sample = form.data["sample"],
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
        inst.sample = form.data["sample"]
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

    db.session.delete(inst)
    db.session.commit()
    
    return {"message": "Instrument successfully deleted"}