from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class SaleItemSchema(BaseModel):
    productId: str
    productName: str
    quantity: int = Field(..., ge=1)
    unitPrice: float = Field(..., ge=0)
    total: float = Field(..., ge=0)


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, description="Product name")
    category: str = Field(..., min_length=1, description="Product category")
    description: Optional[str] = None
    purchase_price: float = Field(..., ge=0, description="Cost price")
    selling_price: float = Field(..., ge=0, description="Sales price")
    stock_quantity: int = Field(..., ge=0, description="Current stock")
    minimum_stock: int = Field(..., ge=0, description="Reorder threshold")
    supplier: Optional[str] = None
    business_id: str = "default-business"


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    category: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    purchase_price: Optional[float] = Field(default=None, ge=0)
    selling_price: Optional[float] = Field(default=None, ge=0)
    stock_quantity: Optional[int] = Field(default=None, ge=0)
    minimum_stock: Optional[int] = Field(default=None, ge=0)
    supplier: Optional[str] = None
    business_id: Optional[str] = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime


class SaleBase(BaseModel):
    business_id: str = "default-business"
    customer_name: str = Field(..., min_length=1, description="Customer name")
    total_amount: float = Field(..., ge=0)
    margin_amount: float = Field(..., ge=0)
    payment_method: str = Field(default="UPI")
    invoice_number: Optional[str] = None
    items: list[SaleItemSchema] = Field(default_factory=list)


class SaleCreate(SaleBase):
    pass


class SaleUpdate(BaseModel):
    business_id: Optional[str] = None
    customer_name: Optional[str] = Field(default=None, min_length=1)
    total_amount: Optional[float] = Field(default=None, ge=0)
    margin_amount: Optional[float] = Field(default=None, ge=0)
    payment_method: Optional[str] = None
    invoice_number: Optional[str] = None
    items: Optional[list[SaleItemSchema]] = None


class SaleResponse(SaleBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime


class CustomerBase(BaseModel):
    business_id: str = "default-business"
    name: str = Field(..., min_length=1)
    email: Optional[str] = None
    phone: Optional[str] = None
    total_spent: float = Field(default=0, ge=0)
    total_orders: int = Field(default=0, ge=0)
    outstanding_balance: float = Field(default=0, ge=0)
    segment: str = Field(default="Regular")
    last_purchase_at: Optional[datetime] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    business_id: Optional[str] = None
    name: Optional[str] = Field(default=None, min_length=1)
    email: Optional[str] = None
    phone: Optional[str] = None
    total_spent: Optional[float] = Field(default=None, ge=0)
    total_orders: Optional[int] = Field(default=None, ge=0)
    outstanding_balance: Optional[float] = Field(default=None, ge=0)
    segment: Optional[str] = None
    last_purchase_at: Optional[datetime] = None


class CustomerResponse(CustomerBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
