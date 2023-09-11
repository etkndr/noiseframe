from app.models import db, Instrument, environment, SCHEMA
from sqlalchemy.sql import text

def seed_instruments():
    test1 = Instrument(
        user_id=1, title="test1", type="sampler", sample=[], osc="", env=1)
    test2 = Instrument(
        user_id=1, title="test2", type="sampler", sample=[], osc="", env=1)
    test3 = Instrument(
        user_id=3, title="test3", type="sampler", sample=[], osc="", env=1)
    test4 = Instrument(
        user_id=3, title="test4", type="sampler", sample=[], osc="", env=1)

    db.session.add(test1)
    db.session.add(test2)
    db.session.add(test3)
    db.session.add(test4)
    db.session.commit()

def undo_instruments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.instruments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM instruments"))
        
    db.session.commit()