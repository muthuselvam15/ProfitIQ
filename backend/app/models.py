import datetime
import uuid

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, JSON, Index
from sqlalchemy.orm import relationship

from database import Base


class Business(Base):
    __tablename__ = "businesses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    currency = Column(String, default="₹")
    location = Column(String)
    subscription_tier = Column(String, nullable=False, default="FREE")
    razorpay_subscription_id = Column(String)
    subscription_status = Column(String, nullable=False, default="inactive")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship("User", back_populates="business")
    products = relationship("Product", back_populates="business")
    sales = relationship("Sale", back_populates="business")
    expenses = relationship("Expense", back_populates="business")
    customers = relationship("Customer", back_populates="business")
    invoices = relationship("Invoice", back_populates="business")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="OWNER")
    tier = Column(String, default="PRO")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="users")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False, default="default-business", index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    purchase_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    minimum_stock = Column(Integer, nullable=False, default=0)
    supplier = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    business = relationship("Business", back_populates="products")

    __table_args__ = (
        Index("ix_products_low_stock", "business_id", "stock_quantity", "minimum_stock"),
    )


class Sale(Base):
    __tablename__ = "sales"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    customer_name = Column(String)
    invoice_number = Column(String, nullable=True)
    total_amount = Column(Float, nullable=False)
    margin_amount = Column(Float, nullable=False)
    payment_method = Column(String, default="CASH")
    items_json = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="sales")

    @property
    def items(self):
        return self.items_json or []


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    vendor = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="expenses")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    total_spent = Column(Float, default=0.0)
    total_orders = Column(Integer, default=0)
    outstanding_balance = Column(Float, default=0.0)
    segment = Column(String, default="Regular")
    last_purchase_at = Column(DateTime)

    business = relationship("Business", back_populates="customers")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_number = Column(String, nullable=False)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"))
    customer_name = Column(String, nullable=False)
    customer_email = Column(String)
    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    due_date = Column(DateTime, nullable=False)
    status = Column(String, default="PENDING")
    items_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    business = relationship("Business", back_populates="invoices")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, default="UNREAD")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class BusinessGoal(Base):
    __tablename__ = "business_goals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    title = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(DateTime)
    category = Column(String)
