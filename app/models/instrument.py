from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Instrument(db.Model):
    __tablename__ = "instruments"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    sample = db.Column(db.String(255))
    osc = db.Column(db.String(255))
    env = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    user = db.relationship("User", back_populates="instrument")
    track = db.relationship("Track", back_populates="instrument")

    
    def to_dict(self):
        return {
            'id': self.id,
            "user_id": self.user_id,
            "title": self.title,
            "type": self.type,
            "sample": self.sample,
            "osc": self.osc,
            "env": self.env,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }