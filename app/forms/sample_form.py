from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField, StringField
from wtforms.validators import DataRequired
from app.api.aws_helpers import ALLOWED_EXTENSIONS

class SampleForm(FlaskForm):
    name = StringField("Sample name", validators=[DataRequired()])
    sample = FileField("Sample file", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    steps = StringField("Steps")
    submit = SubmitField("Add sample")