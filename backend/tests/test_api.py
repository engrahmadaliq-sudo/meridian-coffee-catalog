import os
import sys
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app import app, db


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "ok"


def test_list_products(client):
    resp = client.get("/api/products")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "tasting_notes" in data[0]


def test_filter_by_origin(client):
    resp = client.get("/api/products?origin=Ethiopia")
    assert resp.status_code == 200
    data = resp.get_json()
    assert all(p["origin_country"] == "Ethiopia" for p in data)


def test_product_not_found(client):
    resp = client.get("/api/products/999999")
    assert resp.status_code == 404


def test_create_order(client):
    products = client.get("/api/products").get_json()
    product_id = products[0]["id"]
    resp = client.post(
        "/api/orders",
        data=json.dumps({"customer_name": "Test Buyer", "items": [{"product_id": product_id, "qty": 2}]}),
        content_type="application/json",
    )
    assert resp.status_code == 201
    order = resp.get_json()
    assert order["customer_name"] == "Test Buyer"
    assert order["total_usd"] > 0


def test_create_order_requires_items(client):
    resp = client.post(
        "/api/orders",
        data=json.dumps({"customer_name": "Test Buyer", "items": []}),
        content_type="application/json",
    )
    assert resp.status_code == 400
