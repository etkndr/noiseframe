from flask import Blueprint, request
from app.models import db, Sample, Instrument
from app.forms import StepForm
from flask_login import current_user, login_required
from app.api.aws_helpers import remove_file_from_s3
from .auth_routes import validation_errors_to_error_messages

sample_routes = Blueprint("samples", __name__)
    
# DELETE SAMPLE
@sample_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_sample(id):
    sample = Sample.query.get(id)
    if not sample:
        return {"errors": "Sample not found"}, 404
    
    inst = Instrument.query.get(sample.instrument_id)
    if inst.user_id != current_user.id:
        return {"errors": "Samples can only be deleted by instrument creator"}, 400
    
    db.session.delete(sample)
    db.session.commit()
    
    return {"message": "Sample successfully deleted"}