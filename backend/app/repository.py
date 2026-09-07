"""
Very small repository layer sitting between the API routers and the mock
JSON data source. Keeping this as its own module means swapping the JSON
file for a real database later only touches this file, not the routers.
"""
import json
from pathlib import Path
from typing import List, Optional

from .models import Product

_DATA_PATH = Path(__file__).parent / "data" / "products.json"

_cache: Optional[List[Product]] = None


def _load() -> List[Product]:
    global _cache
    if _cache is None:
        with open(_DATA_PATH, "r") as f:
            raw = json.load(f)
        _cache = [Product(**item) for item in raw]
    return _cache


def list_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
) -> List[Product]:
    products = _load()

    if category:
        products = [p for p in products if p.category.lower() == category.lower()]
    if brand:
        products = [p for p in products if p.brand.lower() == brand.lower()]
    if search:
        term = search.lower()
        products = [
            p for p in products
            if term in p.name.lower() or term in p.brand.lower() or term in p.description.lower()
        ]
    return products


def get_product(product_id: str) -> Optional[Product]:
    return next((p for p in _load() if p.id == product_id), None)


def list_categories() -> List[str]:
    return sorted({p.category for p in _load()})
