from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import UserRole


# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role: UserRole = UserRole.fisher


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ── Catch ─────────────────────────────────────────────
class CatchCreate(BaseModel):
    fish_type: str
    weight_kg: float
    location: str
    catch_date: str
    price_per_kg: Optional[float] = None
    phone: str
    description: Optional[str] = None


class CatchUpdate(BaseModel):
    fish_type: Optional[str] = None
    weight_kg: Optional[float] = None
    location: Optional[str] = None
    catch_date: Optional[str] = None
    price_per_kg: Optional[float] = None
    phone: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class CatchOut(BaseModel):
    id: int
    fish_type: str
    weight_kg: float
    location: str
    catch_date: str
    price_per_kg: Optional[float]
    phone: str
    description: Optional[str]
    status: str
    qr_code_path: Optional[str]
    owner_id: int
    created_at: datetime
    owner: UserOut

    class Config:
        from_attributes = True
