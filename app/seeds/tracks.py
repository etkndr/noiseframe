from app.models import db, Track, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tracks():
    test1 = Track(
        song_id=1, sample_id=1, steps="C3 C3 null null C3 null null null null C3 null C3 null null null null", volume=0.5)
    test2 = Track(
        song_id=2, sample_id=2, steps="C3 C3 null null C3 null null null null C3 null C3 null null null null", volume=0.5)
    test3 = Track(
        song_id=3, sample_id=3, steps="C3 C3 null null C3 null null null null C3 null C3 null null null null", volume=0.5)
    test4 = Track(
        song_id=1, sample_id=4, steps="null null C3 null null C3 C# null C3 null null null null null null null", volume=0.5)
        

    db.session.add(test1)
    db.session.add(test2)
    db.session.add(test3)
    db.session.add(test4)
    db.session.commit()

def undo_tracks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tracks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tracks"))
        
    db.session.commit()