from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from .. import repository
from ..models import EmiQuote, Product, ProductSummary

router = APIRouter(prefix="/api/products", tags=["products"])


def _to_summary(product: Product) -> ProductSummary:
    cheapest = min(product.variants, key=lambda v: v.price)
    return ProductSummary(
        id=product.id,
        name=product.name,
        brand=product.brand,
        category=product.category,
        image=product.images[0] if product.images else "",
        rating=product.rating,
        ratingCount=product.ratingCount,
        minPrice=cheapest.price,
        minMrp=cheapest.mrp,
        inStock=any(v.in_stock for v in product.variants),
    )


@router.get("", response_model=List[ProductSummary])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category, e.g. Audio"),
    brand: Optional[str] = Query(None, description="Filter by brand, e.g. boAt"),
    search: Optional[str] = Query(None, description="Free-text search over name/brand/description"),
):
    """List marketplace products (summary shape, for the listing screen)."""
    products = repository.list_products(category=category, brand=brand, search=search)
    return [_to_summary(p) for p in products]


@router.get("/categories", response_model=List[str])
def get_categories():
    return repository.list_categories()


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str):
    """Full product detail, including all variants and EMI plans."""
    product = repository.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product


@router.get("/{product_id}/emi-quote", response_model=EmiQuote)
def get_emi_quote(product_id: str, variant_id: str, plan_id: str):
    """
    Compute a concrete EMI quote for a product's variant + plan combination.
    Kept server-side (rather than trusting a client-computed number) since
    this is the kind of figure a real fintech app must not let the client
    fabricate.
    """
    product = repository.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")

    variant = next((v for v in product.variants if v.id == variant_id), None)
    if variant is None:
        raise HTTPException(status_code=404, detail=f"Variant '{variant_id}' not found")

    plan = next((p for p in product.emiPlans if p.id == plan_id), None)
    if plan is None:
        raise HTTPException(status_code=404, detail=f"EMI plan '{plan_id}' not found")

    principal = variant.price
    total_interest = principal * (plan.interestRatePct / 100)
    total_payable = principal + total_interest + plan.processingFee
    monthly_installment = total_payable / plan.tenureMonths

    return EmiQuote(
        planId=plan.id,
        tenureMonths=plan.tenureMonths,
        interestRatePct=plan.interestRatePct,
        processingFee=plan.processingFee,
        principal=principal,
        totalPayable=round(total_payable, 2),
        monthlyInstallment=round(monthly_installment, 2),
    )
