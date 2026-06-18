import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

from models import db, Product, Order
from seed import seed_if_empty

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "instance", "meridian.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db.init_app(app)

with app.app_context():
    db.create_all()
    seed_if_empty()


@app.get("/api/health")
def health():
    return jsonify(status="ok")


@app.get("/api/meta")
def meta():
    """Distinct filter values for building the frontend filter bar."""
    origins = sorted({p.origin_country for p in Product.query.all()})
    processes = sorted({p.process for p in Product.query.all()})
    return jsonify(origins=origins, processes=processes,
                    roast_levels=[
                        {"value": 1, "label": "Light"},
                        {"value": 2, "label": "Light-Medium"},
                        {"value": 3, "label": "Medium"},
                        {"value": 4, "label": "Medium-Dark"},
                        {"value": 5, "label": "Dark"},
                    ])


@app.get("/api/products")
def list_products():
    query = Product.query

    origin = request.args.get("origin")
    if origin:
        query = query.filter(Product.origin_country == origin)

    process = request.args.get("process")
    if process:
        query = query.filter(Product.process == process)

    roast = request.args.get("roast", type=int)
    if roast:
        query = query.filter(Product.roast_level == roast)

    search = request.args.get("search", "").strip().lower()
    products = query.order_by(Product.name).all()
    if search:
        products = [
            p for p in products
            if search in p.name.lower()
            or search in p.origin_country.lower()
            or search in p.region.lower()
            or any(search in note.lower() for note in json.loads(p.tasting_notes))
        ]

    return jsonify([p.to_dict() for p in products])


@app.get("/api/products/<int:product_id>")
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify(error="Product not found"), 404
    return jsonify(product.to_dict())


@app.post("/api/orders")
def create_order():
    payload = request.get_json(silent=True) or {}
    customer_name = (payload.get("customer_name") or "Guest").strip() or "Guest"
    items = payload.get("items") or []

    if not items:
        return jsonify(error="Order must contain at least one item"), 400

    order_items = []
    total = 0.0
    for raw in items:
        product = Product.query.get(raw.get("product_id"))
        qty = max(1, int(raw.get("qty", 1)))
        if not product:
            return jsonify(error=f"Unknown product_id {raw.get('product_id')}"), 400
        line_total = product.price_usd * qty
        total += line_total
        order_items.append({
            "product_id": product.id,
            "name": product.name,
            "qty": qty,
            "price_usd": product.price_usd,
            "line_total": round(line_total, 2),
        })

    order = Order(
        customer_name=customer_name,
        items_json=json.dumps(order_items),
        total_usd=round(total, 2),
    )
    db.session.add(order)
    db.session.commit()

    return jsonify(order.to_dict()), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
