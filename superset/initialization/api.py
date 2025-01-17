import logging
from flask import jsonify, request
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from marshmallow import ValidationError
from superset.initialization.models import Charts, Base  
from superset.initialization.schemas import ChartCreateSchema
from datetime import datetime

DB_NAME = "testdb"
DB_USER = "superset"
DB_PASSWORD = "superset"
DB_HOST = "superset_db"
DB_PORT = "5432"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = create_engine(f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
Session = sessionmaker(bind=engine)
session = Session()

Base.metadata.create_all(bind=engine)
logger.info("All tables created successfully!")

class API:
    @staticmethod
    def create_chart():
        try:
            schema = ChartCreateSchema()
            chart_data = schema.load(request.json)

            required_fields = ["name", "description", "type", "configuration"]
            missing_fields = [field for field in required_fields if not chart_data.get(field)]
            if missing_fields:
                return jsonify({
                    "id": "",
                    "ver": "1.0",
                    "ets": int(datetime.utcnow().isoformat()),
                    "responseCode": "FAILED",
                    "error": {
                        "message": f"Missing required fields: {', '.join(missing_fields)}",
                        "code": 400
                    },
                    "result": {}
                }), 400

            existing_chart = session.query(Charts).filter_by(id=chart_data.get("id")).first()
            if existing_chart:
                return jsonify({
                    "id": chart_data.get("id"),
                    "ver": "1.0",
                    "ets": int(datetime.now().timestamp() * 1000),
                    "responseCode": "FAILED",
                    "error": {
                        "message": f"A chart with ID {chart_data.get('id')} already exists.",
                        "code": 400
                    },
                    "result": {}
                }), 400

            chart_type = chart_data["type"].upper()

            new_chart = Charts(
                id=chart_data.get("id"),
                name=chart_data["name"],
                description=chart_data["description"],
                type=chart_type, 
                query=chart_data.get("query"),
                configuration=chart_data["configuration"],
            )

            session.add(new_chart)
            session.commit()

            return jsonify({
                "status": "success",
                "message": "Chart created successfully!",
                "chart": schema.dump(new_chart),
            }), 201

        except ValidationError as ve:
            logger.error(f"Validation error: {ve.messages}")
            return jsonify({
                "id":"",
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "FAILED",
                "error": {
                    "message": f"Invalid format",
                    "code": 400
                },
                "result": {}
            }), 400

        except Exception as e:
            logger.error(f"Error creating chart: {e}")
            session.rollback()
            return jsonify({
                "id": "",
                "ver": "1.0",
                "ets": int(datetime.now().timestamp() * 1000),
                "responseCode": "FAILED",
                "error": {
                    "message": f"Error creating chart",
                    "code": 400
                },
                "result": {}
            }), 500

    @staticmethod
    def get_charts():
        """API endpoint to retrieve all charts"""
        try:
            charts = session.query(Charts).all()
            chart_list = [
                {
                    "id": str(chart.id),
                    "name": chart.name,
                    "description": chart.description,
                    "type": chart.type.value,
                    "query": chart.query,
                    "configuration": chart.configuration,
                    "created_at": chart.created_at,
                    "updated_at": chart.updated_at,
                }
                for chart in charts
            ]
            return jsonify({
                "status": "success",
                "charts": chart_list,
            }), 200

        except Exception as e:
            logger.error(f"Error retrieving charts: {e}")
            return jsonify({
                "status": "error",
                "message": "Failed to retrieve charts.",
            }), 500