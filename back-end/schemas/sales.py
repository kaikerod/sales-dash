from pydantic import BaseModel, field_validator
from datetime import date

class SaleBase(BaseModel):
    product: str
    category: str
    quantity: int
    unit_price: float
    sale_date: date

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantidade deve ser maior que zero")
        return v

    @field_validator("unit_price")
    @classmethod
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Preço deve ser maior que zero")
        return v


class SaleCreate(SaleBase):
    pass


class SaleUpdate(BaseModel):
    product: str | None = None
    category: str | None = None
    quantity: int | None = None
    unit_price: float | None = None
    sale_date: date | None = None


class SaleResponse(SaleBase):
    id: int
    total: float

    model_config = {"from_attributes": True}