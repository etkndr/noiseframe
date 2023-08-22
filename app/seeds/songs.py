from app.models import db, Song, environment, SCHEMA
from sqlalchemy.sql import text



def seed_songs():
    song1 = Song(
        user_id=1, title='Song1', bpm=100)
    song2 = Song(
        user_id=2, title='Song2', bpm=130)    
    song3 = Song(
        user_id=3, title='Song3', bpm=150)
    db.session.add(song1)
    db.session.add(song2)
    db.session.add(song3)
    db.session.commit()

def undo_songs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM songs"))
        
    db.session.commit()