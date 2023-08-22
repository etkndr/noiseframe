from app.models import db, Track, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tracks():
    test1 = Track(
        song_id=1, instrument_id=1, title='test1', notes="C3 E3 G3", volume=0.5)
    test2 = Track(
        song_id=2, instrument_id=2, title='test2', notes="C3 E3 G3", volume=0.5)
    test3 = Track(
        song_id=3, instrument_id=3, title='test3', notes="C3 E3 G3", volume=0.5)

    db.session.add(test1)
    db.session.add(test2)
    db.session.add(test3)
    db.session.commit()

def undo_tracks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tracks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tracks"))
        
    db.session.commit()