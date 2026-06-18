import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

ROAST_LABELS = {1: "Light", 2: "Light-Medium", 3: "Medium", 4: "Medium-Dark", 5: "Dark"}


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    origin_country = db.Column(db.String(60), nullable=False)
    region = db.Column(db.String(80), nullable=False)
    farm = db.Column(db.String(120), nullable=False)
    roast_level = db.Column(db.Integer, nullable=False)  # 1 (light) - 5 (dark)
    process = db.Column(db.String(40), nullable=False)   # washed, natural, honey, anaerobic, wet-hulled
    altitude_m = db.Column(db.Integer, nullable=False)
    tasting_notes = db.Column(db.Text, nullable=False)    # stored as JSON list
    price_usd = db.Column(db.Float, nullable=False)
    weight_g = db.Column(db.Integer, nullable=False)
    stock_count = db.Column(db.Integer, nullable=False, default=0)
    limited = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "origin_country": self.origin_country,
            "region": self.region,
            "farm": self.farm,
            "roast_level": self.roast_level,
            "roast_label": ROAST_LABELS.get(self.roast_level, "Medium"),
            "process": self.process,
            "altitude_m": self.altitude_m,
            "tasting_notes": json.loads(self.tasting_notes),
            "price_usd": self.price_usd,
            "weight_g": self.weight_g,
            "stock_count": self.stock_count,
            "limited": self.limited,
            "in_stock": self.stock_count > 0,
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(120), nullable=False)
    items_json = db.Column(db.Text, nullable=False)  # JSON list of {product_id, name, qty, price_usd}
    total_usd = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_name": self.customer_name,
            "items": json.loads(self.items_json),
            "total_usd": self.total_usd,
            "created_at": self.created_at.isoformat(),
        }
