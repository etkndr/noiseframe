from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField
from wtforms.validators import DataRequired

class StepForm(FlaskForm):
    name = StringField("Sample name", validators=[DataRequired()])
    url = StringField("Sample url", validators=[DataRequired()])
    steps = StringField("Steps")
    submit = SubmitField("Add sample")