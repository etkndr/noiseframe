from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class SongForm(FlaskForm):
    title = StringField("Song title", validators=[DataRequired()])
    bpm = IntegerField("BPM", validators=[DataRequired(), NumberRange(10,300)])
    submit = SubmitField("Submit")