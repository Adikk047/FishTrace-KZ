from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class UserRole(str, enum.Enum):
    fisher = "fisher"
    buyer = "buyer"
    inspector = "inspector"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.fisher, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    catches = relationship("Catch", back_populates="owner")


class Catch(Base):
    __tablename__ = "catches"

    id = Column(Integer, primary_key=True, index=True)
    fish_type = Column(String, nullable=False)
    weight_kg = Column(Float, nullable=False)
    location = Column(String, nullable=False)
    catch_date = Column(String, nullable=False)
    price_per_kg = Column(Float, nullable=True)
    phone = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="available")  # available, sold
    qr_code_path = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="catches")
