from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Track(db.Model):
    __tablename__ = "tracks"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("songs.id")), nullable=False)
    sample_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("samples.id")), nullable=False)
    steps = db.Column(db.String(255), nullable=False)
    volume = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    song = db.relationship("Song", back_populates="track")
    sample = db.relationship("Sample", back_populates="track")
    
    def to_dict(self):
        return {
            'id': self.id,
            "song_id": self.song_id,
            "sample_id": self.sample_id,
            "steps": self.steps,
            "volume": self.volume,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }