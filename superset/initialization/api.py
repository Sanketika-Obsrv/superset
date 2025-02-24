import logging
from flask import jsonify, request
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from marshmallow import ValidationError
from superset.initialization.schemas import ChartCreateSchema, ChartUpdateSchema
from superset.initialization.models import Charts, Base
from datetime import datetime
import os

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

engine = create_engine(f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")


Session = sessionmaker(bind=engine)
session = Session()

Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChartAPI:
    # def create_chart():
    #     try:
    #         schema = ChartCreateSchema()
    #         chart_data = schema.load(request.json)  
    #         existing_chart = session.query(Charts).filter_by(slice_id=chart_data.get("slice_id")).first()
    #         if existing_chart:
    #             return jsonify({
    #                 "id": chart_data.get("slice_id"),
    #                 "ver": "1.0",
    #                 "ets": int(datetime.now().timestamp() * 1000),
    #                 "responseCode": "FAILED",
    #                 "error": {
    #                     "message": f"A chart with ID {chart_data.get('slice_id')} already exists.",
    #                     "code": 400
    #                 },
    #                 "result": {}
    #             }), 400

    #         chart_type = chart_data["type"].upper()
    #         new_chart = Charts(
    #             id=chart_data.get("id"),
    #             name=chart_data["name"],
    #             description=chart_data["description"],
    #             type=chart_type,
    #             slice_id=chart_data["slice_id"],
    #             query=chart_data.get("query"),
    #             configuration=chart_data["configuration"],
    #         )

    #         session.add(new_chart)
    #         session.commit()

    #         return jsonify({
    #             "id": chart_data.get("id"),
    #             "ver": "1.0",
    #             "ets": int(datetime.now().timestamp() * 1000),
    #             "responseCode": "OK",
    #             "result":{
    #                 "message": "Chart metadata saved successfully."
    #             }
    #         }), 201

    #     except ValidationError as ve:
    #         logger.error(f"Validation error: {ve.messages}")
    #         return jsonify({
    #             "id": "",
    #             "ver": "1.0",
    #             "ets": int(datetime.now().timestamp() * 1000),
    #             "responseCode": "FAILED",
    #             "error": {
    #                 "message": ve.messages,
    #                 "code": 400
    #             },
    #             "result": {}
    #         }), 400

    #     except Exception as e:
    #         logger.error(f"Unexpected error: {e}")
    #         session.rollback()
    #         return jsonify({
    #             "id": "",
    #             "ver": "1.0",
    #             "ets": int(datetime.now().timestamp() * 1000),
    #             "responseCode": "FAILED",
    #             "error": {
    #                 "message": e,
    #                 "code": 500
    #             },
    #             "result": {}
    #         }), 500

    def save_chart(slice_id):
        try:
            slice_id = int(slice_id)
            
            chart = session.query(Charts).filter_by(slice_id=slice_id).first()
            update_data = request.get_json()
            if not chart:
                try:
                    schema = ChartCreateSchema()
                    chart_data = schema.load(request.json)  
                    existing_chart = session.query(Charts).filter_by(slice_id=chart_data.get("slice_id")).first()
                    if existing_chart:
                        return jsonify({
                            "id": chart_data.get("slice_id"),
                            "ver": "1.0",
                            "ets": int(datetime.now().timestamp() * 1000),
                            "responseCode": "FAILED",
                            "error": {
                                "message": f"A chart with ID {chart_data.get('slice_id')} already exists.",
                                "code": 400
                            },
                            "result": {}
                        }), 400

                    new_chart = Charts(
                        id=chart_data.get("id"),
                        description=chart_data["description"],
                        slice_id=chart_data["slice_id"],
                        query=chart_data.get("query"),
                        configuration=chart_data["configuration"],
                    )

                    session.add(new_chart)
                    session.commit()

                    return jsonify({
                        "id": chart_data.get("id"),
                        "ver": "1.0",
                        "ets": int(datetime.now().timestamp() * 1000),
                        "responseCode": "OK",
                        "result":{
                            "message": "Chart metadata saved successfully."
                        }
                    }), 201

                except ValidationError as ve:
                    logger.error(f"Validation error: {ve.messages}")
                    return jsonify({
                        "id": "",
                        "ver": "1.0",
                        "ets": int(datetime.now().timestamp() * 1000),
                        "responseCode": "FAILED",
                        "error": {
                            "message": ve.messages,
                            "code": 400
                        },
                        "result": {}
                    }), 400

                except Exception as e:
                    logger.error(f"Unexpected error: {e}")
                    session.rollback()
                    return jsonify({
                        "id": "",
                        "ver": "1.0",
                        "ets": int(datetime.now().timestamp() * 1000),
                        "responseCode": "FAILED",
                        "error": {
                            "message": e,
                            "code": 500
                        },
                        "result": {}
                    }), 500


            if "description" in update_data:
                chart.description = update_data["description"]
            if "query" in update_data:
                chart.query = update_data["query"]
            if "configuration" in update_data:
                chart.configuration = update_data["configuration"]

            chart.updated_at = datetime.now()

            session.commit()

            session.refresh(chart)

            return jsonify({
                "id": str(chart.id),
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "OK",
                "result": {
                    "message": "Chart metadata updated successfully."
                }
            }), 200

        except ValidationError as ve:
            logger.error(f"Validation error: {ve.messages}")
            return jsonify({
                "id": "",
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "FAILED",
                "error": {
                    "message": ve.messages,
                    "code": 400
                },
                "result": {}
            }), 400

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            session.rollback()
            return jsonify({
                "id": slice_id,
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "FAILED",
                "error": {
                    "message": str(e),
                    "code": 500
                },
                "result": {}
            }), 500


    # def delete_chart(slice_id):
        try:
            slice_id = int(slice_id)
            chart = session.query(Charts).filter_by(slice_id=slice_id).first()

            if not chart:
                return jsonify({
                    "id": slice_id,
                    "ver": "1.0",
                    "ets": int(datetime.now().timestamp() * 1000),
                    "responseCode": "FAILED",
                    "error": {
                        "message": f"Chart with slice_id {slice_id} not found.",
                        "code": 404
                    },
                    "result": {}
                }), 404

            chart_id = chart.id

            session.delete(chart)
            session.commit()

            return jsonify({
                "id": chart_id,  
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "OK",
                "result": {
                    "message": f"Chart with slice_id {slice_id} (ID: {chart_id}) deleted successfully."
                }
            }), 200

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            session.rollback()
            return jsonify({
                "id": slice_id,
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "FAILED",
                "error": {
                    "message": str(e),
                    "code": 500
                },
                "result": {}
            }), 500


    def get_chart(slice_id):
        try:
            slice_id = int(slice_id)
            chart = session.query(Charts).filter_by(slice_id=slice_id).first()

            if not chart:
                return jsonify({
                    "id":slice_id,
                    "ver":"1.0",
                    "ets":int(datetime.now().timestamp() * 1000),
                    "responseCode": "FAILED",
                    "error": {
                        "message": f"Chart with slice_id {slice_id}  not present",
                        "code": 400
                    },
                    "result": {}
                }), 500


            return {
                "id": "",
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "OK",
                "result": {
                    "id": str(chart.id), 
                    "description": chart.description,
                    "query": chart.query,
                    "configuration": chart.configuration,
                    "slice_id": chart.slice_id,
                    "created_at": chart.created_at.isoformat(), 
                    "updated_at": chart.updated_at.isoformat() if chart.updated_at else None 
                }
            }
            

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            session.rollback()
            return jsonify({
                "id": slice_id,
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "FAILED",
                "error": {
                    "message": str(e),
                    "code": 500
                },
                "result": {}
            }), 500

