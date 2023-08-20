from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Track(db.Model):
    __tablename__ = "tracks"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False)
    instrument_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("instruments.id")), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    notes = db.Column(db.String(255))
    volume = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    song = db.relationship("Song", back_populates="track")
    instrument = db.relationship("Instrument", back_populates="track")
    
    def to_dict(self):
        return {
            'id': self.id,
            "song_id": self.song_id,
            "instrument_id": self.instrument_id,
            "title": self.title,
            "notes": self.notes,
            "volume": self.volume,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }