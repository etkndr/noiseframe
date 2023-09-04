from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class TrackForm(FlaskForm):
    instrument_id = IntegerField("Instrument", validators=[DataRequired()])
    title = StringField("Track title", validators=[DataRequired()])
    steps = StringField("Track notes", validators=[DataRequired()])
    volume = IntegerField("Volume", validators=[NumberRange(-10, -1)])
    submit = SubmitField("Submit")