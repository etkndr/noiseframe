from app.models import db, Sample, environment, SCHEMA
from sqlalchemy.sql import text

def seed_samples():
    sample1 = Sample(
        instrument_id=1, name="tom", url="https://noiseframe.s3.us-east-2.amazonaws.com/3d494ce2ef36465581668a13bf6f277a.wav", steps="C3 C3 null null C3 null null null null C3 null C3 null null null null")
    sample2 = Sample(
        instrument_id=2, name="closed hat", url="https://noiseframe.s3.us-east-2.amazonaws.com/6cb1ad1768944984baa47f93cd1ed4bd.wav", steps="C3 null null null C3 null C3 null null C3 null C3 null null null null")
    sample3 = Sample(
        instrument_id=3, name="cowbell", url="https://noiseframe.s3.us-east-2.amazonaws.com/3fee5cb5ccbe45dca3d3558d7fb1b29a.wav", steps="C3 null C3 null C3 null C3 null C3 null C3 null C3 null C3 null")

    db.session.add(sample1)
    db.session.add(sample2)
    db.session.add(sample3)
    db.session.commit()

def undo_samples():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.samples RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM samples"))
        
    db.session.commit()