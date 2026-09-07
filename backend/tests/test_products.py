from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_list_products():
    resp = client.get("/api/products")
    assert resp.status_code == 200
    body = resp.json()
    assert isinstance(body, list)
    assert len(body) > 0
    assert "minPrice" in body[0]


def test_filter_by_category():
    resp = client.get("/api/products", params={"category": "Audio"})
    assert resp.status_code == 200
    body = resp.json()
    assert all(p["category"] == "Audio" for p in body)


def test_search():
    resp = client.get("/api/products", params={"search": "laptop"})
    assert resp.status_code == 200
    body = resp.json()
    assert any("HP" in p["brand"] for p in body)


def test_get_product_detail():
    resp = client.get("/api/products/p001")
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == "p001"
    assert len(body["variants"]) >= 1
    assert len(body["emiPlans"]) >= 1


def test_get_product_not_found():
    resp = client.get("/api/products/does-not-exist")
    assert resp.status_code == 404


def test_emi_quote_calculation():
    resp = client.get(
        "/api/products/p001/emi-quote",
        params={"variant_id": "p001-v1", "plan_id": "emi-6m"},
    )
    assert resp.status_code == 200
    body = resp.json()
    # principal 2799, 8% interest, 49 processing fee
    expected_total = round(2799 + 2799 * 0.08 + 49, 2)
    assert body["totalPayable"] == expected_total
    assert body["monthlyInstallment"] == round(expected_total / 6, 2)


def test_emi_quote_invalid_variant():
    resp = client.get(
        "/api/products/p001/emi-quote",
        params={"variant_id": "does-not-exist", "plan_id": "emi-6m"},
    )
    assert resp.status_code == 404


def test_categories():
    resp = client.get("/api/products/categories")
    assert resp.status_code == 200
    assert "Audio" in resp.json()
