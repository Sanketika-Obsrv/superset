from marshmallow import Schema, fields, EXCLUDE
import uuid



class ChartCreateSchema(Schema):
    id = fields.UUID(required=False, missing=lambda: str(uuid.uuid4()),  error_messages={"Duplicate": "Id is already present."}) 
    description = fields.String(required=True, error_messages={"required": "Description is required."})
    slice_id = fields.Integer(required=True,error_messages={"required": "Slice Id is required."})
    query = fields.String(required=True,error_messages={"required": "Druid SQL Query is required."})  
    configuration = fields.Dict(required=True, error_messages={"required": "Configuration is required."})

    class Meta:
        unknown = EXCLUDE 


class ChartUpdateSchema(Schema):
    id = fields.UUID(required=False)  
    description = fields.String(required=False)
    slice_id = fields.Integer(required=True, error_messages={"required": "Slice Id is required."})
    query = fields.String(required=False)  
    configuration = fields.Dict(required=False)  

    class Meta:
        unknown = EXCLUDE 

# class ChartDeleteSchema(Schema):
#     slice_id = fields.Integer(required=True, error_messages={"required": "Slice Id is required."})

#     class Meta:
#         unknown = EXCLUDE  
