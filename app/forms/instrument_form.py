from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FloatField
from wtforms.validators import DataRequired, NumberRange

class InstrumentForm(FlaskForm):
    title = StringField("Instrument title", validators=[DataRequired()])
    type = StringField("Instrument type", validators=[DataRequired()])
    osc = StringField("Oscillator")
    env = FloatField("Envelope", validators=[DataRequired(), NumberRange(0.5, 1)])
    submit = SubmitField("Submit")