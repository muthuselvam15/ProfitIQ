import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Business(Base):
    __tablename__ = "businesses"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    currency = Column(String, default="₹")
    location = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="business")
    products = relationship("Product", back_populates="business")
    sales = relationship("Sale", back_populates="business")
    expenses = relationship("Expense", back_populates="business")
    customers = relationship("Customer", back_populates="business")
    invoices = relationship("Invoice", back_populates="business")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="OWNER") # OWNER, MANAGER, STAFF
    tier = Column(String, default="PRO") # FREE, PRO, PREMIUM
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    business = relationship("Business", back_populates="users")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    cost_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    current_stock = Column(Integer, default=0)
    reorder_point = Column(Integer, default=10)
    supplier_lead_time_days = Column(Integer, default=3)
    avg_daily_sales = Column(Float, default=1.0)
    
    business = relationship("Business", back_populates="products")

class Sale(Base):
    __tablename__ = "sales"
    
    id = Column(String, primary_key=True)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    customer_name = Column(String)
    total_amount = Column(Float, nullable=False)
    margin_amount = Column(Float, nullable=False)
    payment_method = Column(String, default="CASH")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    business = relationship("Business", back_populates="sales")

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(String, primary_key=True)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    category = Column(String, nullable=False) # Transportation, Supplies, Rent, Utilities, Salaries
    amount = Column(Float, nullable=False)
    vendor = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    business = relationship("Business", back_populates="expenses")

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String, primary_key=True)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    total_spent = Column(Float, default=0.0)
    total_orders = Column(Integer, default=0)
    outstanding_balance = Column(Float, default=0.0)
    segment = Column(String, default="Regular") # Frequent, New, Returning, Inactive, High-Value
    last_purchase_at = Column(DateTime)
    
    business = relationship("Business", back_populates="customers")

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(String, primary_key=True)
    invoice_number = Column(String, nullable=False)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"))
    customer_name = Column(String, nullable=False)
    customer_email = Column(String)
    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    due_date = Column(DateTime, nullable=False)
    status = Column(String, default="PENDING") # PAID, PENDING, OVERDUE, DRAFT
    items_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    business = relationship("Business", back_populates="invoices")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(String, primary_key=True)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, nullable=False) # POSITIVE, ATTENTION, ACTION_REQUIRED, AI_INSIGHT
    status = Column(String, default="UNREAD") # UNREAD, READ, RESOLVED, SNOOZED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BusinessGoal(Base):
    __tablename__ = "business_goals"
    
    id = Column(String, primary_key=True)
    business_id = Column(String, ForeignKey("businesses.id"), nullable=False)
    title = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(DateTime)
    category = Column(String) # Revenue, Profit, Savings, Customer Acquisition
