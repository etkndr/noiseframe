from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField, StringField
from wtforms.validators import DataRequired
from app.api.aws_helpers import ALLOWED_EXTENSIONS

class SampleForm(FlaskForm):
    sample = FileField("Sample file", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    pitch = StringField("Sample pitch", validators=[DataRequired()])
    submit = SubmitField("Add sample")