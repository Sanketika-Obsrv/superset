from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Text, Enum, JSON, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from enum import Enum as PyEnum
import uuid

Base = declarative_base()

class ChartType(PyEnum):
    BAR = "bar"
    LINE = "line"

class Charts(Base):
    __tablename__ = "charts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    type = Column(Enum(ChartType), nullable=False)
    query = Column(Text, nullable=True)
    configuration = Column(JSON, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
