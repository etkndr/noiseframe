from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class InstrumentForm(FlaskForm):
    title = StringField("Instrument title", validators=[DataRequired()])
    type = StringField("Instrument type", validators=[DataRequired()])
    sample = StringField("Sample")
    osc = StringField("Oscillator")
    env = StringField("Envelope", validators=[DataRequired()])
    submit = SubmitField("Submit")