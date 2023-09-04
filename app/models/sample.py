from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Sample(db.Model):
    __tablename__ = "samples"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    instrument_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("instruments.id")), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    instrument = db.relationship("Instrument", back_populates="sample")
    track = db.relationship("Track", back_populates="sample")
    
    def to_dict(self):
        return {
            'id': self.id,
            "instrument_id": self.instrument_id,
            "name": self.name,
            "url": self.url,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }