from typing import List, Optional
from pydantic import BaseModel, Field


class Variant(BaseModel):
    id: str
    label: str
    price: float
    mrp: float
    stock: int

    @property
    def in_stock(self) -> bool:
        return self.stock > 0

    @property
    def discount_pct(self) -> int:
        if self.mrp <= 0:
            return 0
        return round((1 - self.price / self.mrp) * 100)


class EmiPlan(BaseModel):
    id: str
    tenureMonths: int
    interestRatePct: float
    processingFee: float


class Product(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    description: str
    images: List[str]
    rating: float
    ratingCount: int
    variants: List[Variant]
    emiPlans: List[EmiPlan]


class ProductSummary(BaseModel):
    """Lightweight shape used for list views, to avoid over-fetching."""

    id: str
    name: str
    brand: str
    category: str
    image: str
    rating: float
    ratingCount: int
    minPrice: float
    minMrp: float
    inStock: bool


class EmiQuote(BaseModel):
    """Computed EMI quote returned to the client for a given variant + plan."""

    planId: str
    tenureMonths: int
    interestRatePct: float
    processingFee: float
    principal: float
    totalPayable: float
    monthlyInstallment: float


class ErrorResponse(BaseModel):
    detail: str
