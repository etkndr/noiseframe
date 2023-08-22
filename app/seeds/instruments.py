from app.models import db, Instrument, environment, SCHEMA
from sqlalchemy.sql import text

def seed_instruments():
    test1 = Instrument(
        user_id=1, title="test1", type="sampler", sample="/bells.wav", osc="", env="0.8")
    test2 = Instrument(
        user_id=2, title="test2", type="fmSynth", sample="", osc="tri", env="0.8")
    test3 = Instrument(
        user_id=3, title="test3", type="amSynth", sample="", osc="tri", env="0.8")

    db.session.add(test1)
    db.session.add(test2)
    db.session.add(test3)
    db.session.commit()

def undo_instruments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.instruments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM instruments"))
        
    db.session.commit()