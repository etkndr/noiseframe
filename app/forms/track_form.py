from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class TrackForm(FlaskForm):
    steps = StringField("Track notes")
    volume = IntegerField("Volume", validators=[NumberRange(-10, -1)])
    submit = SubmitField("Submit")