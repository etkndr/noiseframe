from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class TrackForm(FlaskForm):
    title = StringField("Track title", validators=[DataRequired()])
    notes = StringField("Track notes")
    volume = IntegerField("Volume", validators=[DataRequired(), NumberRange(-10, -1)])
    submit = SubmitField("Submit")