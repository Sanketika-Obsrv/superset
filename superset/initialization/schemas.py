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
    id = fields.UUID(required=False, missing=lambda: str(uuid.uuid4()),  error_messages={"Duplicate": "Id is already present."}) 
    name = fields.String(required=True, error_messages={"required": "Name is required."})
    description = fields.String(required=True, error_messages={"required": "Description is required."})
    type = fields.String(required=True, validate=validate_type, error_messages={"required": "Type is required."})
    slice_id = fields.Integer(required=True,error_messages={"required": "Slice Id is required."})
    query = fields.String(required=True,error_messages={"required": "Druid SQL Query is required."})  
    configuration = fields.Dict(required=True, error_messages={"required": "Configuration is required."})

    class Meta:
        unknown = EXCLUDE 


class ChartUpdateSchema(Schema):
    id = fields.UUID(required=False) 
    name = fields.String(required=False)  
    description = fields.String(required=False)
    type = fields.String(required=False, validate=validate_type) 
    slice_id = fields.Integer(required=True, error_messages={"required": "Slice Id is required."})
    query = fields.String(required=False)  
    configuration = fields.Dict(required=False)  

    class Meta:
        unknown = EXCLUDE 

class ChartDeleteSchema(Schema):
    slice_id = fields.Integer(required=True, error_messages={"required": "Slice Id is required."})

    class Meta:
        unknown = EXCLUDE  
