from app.models import db, Sample, environment, SCHEMA
from sqlalchemy.sql import text

def seed_samples():
    sample1 = Sample(
        instrument_id=1, url="https://noiseframe.s3.us-east-2.amazonaws.com/Kit_05_02_Snare.aif", pitch="C3")
    sample2 = Sample(
        instrument_id=2, url="https://noiseframe.s3.us-east-2.amazonaws.com/Kit_11_08_Cowbell_C.aif", pitch="C3")
    sample3 = Sample(
        instrument_id=3, url="https://noiseframe.s3.us-east-2.amazonaws.com/Kit_13_01_LowTom_C.aif", pitch="C3")

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