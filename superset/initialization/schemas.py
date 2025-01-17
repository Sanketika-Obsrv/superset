from marshmallow import Schema, fields, ValidationError, EXCLUDE
from enum import Enum
import uuid

class Type(Enum):
    BAR = "bar"
    LINE = "line"

def validate_type(value):
    if value not in [t.value for t in Type]:
        raise ValidationError(f"Invalid chart type: {value}. Must be one of {[t.value for t in Type]}.")

class ChartCreateSchema(Schema):
    id = fields.UUID(required=False, missing=lambda: str(uuid.uuid4())) 
    name = fields.String(required=True)
    description = fields.String(required=True)
    type = fields.String(required=True, validate=validate_type) 
    query = fields.String(required=False, allow_none=True)
    configuration = fields.Dict(required=True)

    class Meta:
        unknown = EXCLUDE 

class ChartUpdateSchema(Schema):
    name = fields.String(required=False, allow_none=True)
    description = fields.String(required=False, allow_none=True)
    type = fields.String(required=False, allow_none=True, validate=validate_type)
    query = fields.String(required=False, allow_none=True)
    configuration = fields.Dict(required=False, allow_none=True)

    class Meta:
        unknown = EXCLUDE  
