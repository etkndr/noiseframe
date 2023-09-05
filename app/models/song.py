from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Song(db.Model):
    __tablename__ = "songs"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    instrument_id = db.Column(db.Integer)
    title = db.Column(db.String(255), nullable=False)
    bpm = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    user = db.relationship("User", back_populates="song")
    track = db.relationship("Track", back_populates="song")
    
    def to_dict(self):
        return {
            'id': self.id,
            "user_id": self.user_id,
            "instrument_id": self.instrument_id,
            "title": self.title,
            "bpm": self.bpm,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }