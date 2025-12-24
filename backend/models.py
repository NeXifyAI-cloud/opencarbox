"""
Carvatoo - Datenmodelle
Vollständige MongoDB-Modelle für E-Commerce
"""

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid


# ============== ENUMS ==============

class UserRole(str, Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


# ============== BENUTZER ==============

class Address(BaseModel):
    street: str
    house_number: str
    postal_code: str
    city: str
    country: str = "Österreich"
    is_default: bool = False


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    addresses: Optional[List[Address]] = None


class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: UserRole = UserRole.CUSTOMER
    addresses: List[Address] = []
    wishlist: List[str] = []  # Produkt-IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class UserInDB(User):
    hashed_password: str


# ============== KATEGORIEN ==============

class SubcategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class Subcategory(SubcategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_count: int = 0


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None


class CategoryCreate(CategoryBase):
    subcategories: List[SubcategoryBase] = []


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None


class Category(CategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subcategories: List[Subcategory] = []
    product_count: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ============== PRODUKTE ==============

class ProductSpecification(BaseModel):
    label: str
    value: str


class VehicleCompatibility(BaseModel):
    brand: str
    model: str
    year_from: int
    year_to: Optional[int] = None


class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    brand: str
    sku: str  # Artikelnummer
    ean: Optional[str] = None
    oem_numbers: List[str] = []  # OE-Nummern


class ProductCreate(ProductBase):
    category_id: str
    subcategory_id: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    images: List[str] = []
    specifications: List[ProductSpecification] = []
    compatibility: List[VehicleCompatibility] = []
    stock: int = 0
    weight: Optional[float] = None  # in kg


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    brand: Optional[str] = None
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    images: Optional[List[str]] = None
    specifications: Optional[List[ProductSpecification]] = None
    compatibility: Optional[List[VehicleCompatibility]] = None
    stock: Optional[int] = None
    weight: Optional[float] = None
    is_active: Optional[bool] = None


class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category_id: str
    subcategory_id: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percent: Optional[int] = None
    images: List[str] = []
    specifications: List[ProductSpecification] = []
    compatibility: List[VehicleCompatibility] = []
    stock: int = 0
    weight: Optional[float] = None
    rating: float = 0.0
    review_count: int = 0
    sold_count: int = 0
    is_active: bool = True
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============== WARENKORB ==============

class CartItem(BaseModel):
    product_id: str
    quantity: int
    price: float  # Preis zum Zeitpunkt des Hinzufügens


class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None  # None für Gäste
    session_id: Optional[str] = None  # Für Gast-Warenkörbe
    items: List[CartItem] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============== BESTELLUNGEN ==============

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    product_sku: str
    product_image: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float


class ShippingInfo(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: Address


class OrderBase(BaseModel):
    shipping_info: ShippingInfo
    billing_same_as_shipping: bool = True
    billing_address: Optional[Address] = None
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    cart_id: str
    payment_method: str


class Order(OrderBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str = Field(default_factory=lambda: f"CT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}")
    user_id: Optional[str] = None
    items: List[OrderItem] = []
    subtotal: float
    shipping_cost: float
    discount: float = 0.0
    discount_code: Optional[str] = None
    total: float
    status: OrderStatus = OrderStatus.PENDING
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_method: str
    tracking_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============== BEWERTUNGEN ==============

class ReviewBase(BaseModel):
    rating: int = Field(ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    product_id: str


class Review(ReviewBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    user_id: str
    user_name: str
    is_verified_purchase: bool = False
    is_approved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ============== GUTSCHEINE ==============

class CouponType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED = "fixed"


class Coupon(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    type: CouponType
    value: float
    min_order_value: float = 0.0
    max_uses: Optional[int] = None
    used_count: int = 0
    valid_from: datetime = Field(default_factory=datetime.utcnow)
    valid_until: Optional[datetime] = None
    is_active: bool = True


# ============== FAHRZEUGE ==============

class VehicleBrand(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    logo: Optional[str] = None


class VehicleModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    brand_id: str
    name: str
    slug: str
    year_from: int
    year_to: Optional[int] = None


class VehicleType(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    model_id: str
    name: str  # z.B. "2.0 TDI 150 PS"
    engine_code: Optional[str] = None
    kba_hsn: Optional[str] = None  # Herstellerschlüsselnummer
    kba_tsn: Optional[str] = None  # Typschlüsselnummer


# ============== DASHBOARD STATISTIKEN ==============

class DashboardStats(BaseModel):
    total_orders: int = 0
    total_revenue: float = 0.0
    total_customers: int = 0
    total_products: int = 0
    pending_orders: int = 0
    low_stock_products: int = 0
    orders_today: int = 0
    revenue_today: float = 0.0
