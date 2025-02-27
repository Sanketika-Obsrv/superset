from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Text, Enum, JSON, TIMESTAMP, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from enum import Enum as PyEnum
import uuid

Base = declarative_base()


class Charts(Base):
    __tablename__ = "report_config"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    description = Column(Text, nullable=False)
    query = Column(Text, nullable=False)
    configuration = Column(JSON, nullable=False)
    slice_id = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
