from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine
import models
from routers import auth, catches

# Create tables
models.Base.metadata.create_all(bind=engine)

# Ensure QR dir exists
os.makedirs("qr_codes", exist_ok=True)

app = FastAPI(
    title="FishTrace KZ API",
    description="Цифровая платформа для учёта улова и продажи рыбы",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(catches.router)

# Serve QR code images
app.mount("/qr_codes", StaticFiles(directory="qr_codes"), name="qr_codes")


@app.get("/")
def root():
    return {"message": "FishTrace KZ API работает ✓", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
