from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import qrcode
import os
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/api/catches", tags=["catches"])

QR_DIR = "qr_codes"
os.makedirs(QR_DIR, exist_ok=True)


def generate_qr(catch_id: int, base_url: str = "http://localhost:5173") -> str:
    url = f"{base_url}/catch/{catch_id}"
    img = qrcode.make(url)
    path = f"{QR_DIR}/catch_{catch_id}.png"
    img.save(path)
    return path


# ── Public endpoints ──────────────────────────────────

@router.get("/", response_model=List[schemas.CatchOut])
def list_catches(
    fish_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.Catch)
    if fish_type:
        q = q.filter(models.Catch.fish_type.ilike(f"%{fish_type}%"))
    if status:
        q = q.filter(models.Catch.status == status)
    if date_from:
        q = q.filter(models.Catch.catch_date >= date_from)
    if date_to:
        q = q.filter(models.Catch.catch_date <= date_to)
    return q.order_by(models.Catch.created_at.desc()).all()


@router.get("/{catch_id}", response_model=schemas.CatchOut)
def get_catch(catch_id: int, db: Session = Depends(get_db)):
    catch = db.query(models.Catch).filter(models.Catch.id == catch_id).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Улов не найден")
    return catch


@router.get("/{catch_id}/qr")
def get_qr(catch_id: int, db: Session = Depends(get_db)):
    catch = db.query(models.Catch).filter(models.Catch.id == catch_id).first()
    if not catch or not catch.qr_code_path:
        raise HTTPException(status_code=404, detail="QR-код не найден")
    return FileResponse(catch.qr_code_path, media_type="image/png")


# ── Fisher endpoints ──────────────────────────────────

@router.post("/", response_model=schemas.CatchOut, status_code=201)
def create_catch(
    data: schemas.CatchCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    if current_user.role not in (models.UserRole.fisher, models.UserRole.inspector):
        raise HTTPException(status_code=403, detail="Только рыбаки могут добавлять улов")

    catch = models.Catch(**data.model_dump(), owner_id=current_user.id)
    db.add(catch)
    db.commit()
    db.refresh(catch)

    # Generate QR
    qr_path = generate_qr(catch.id)
    catch.qr_code_path = qr_path
    db.commit()
    db.refresh(catch)
    return catch


@router.put("/{catch_id}", response_model=schemas.CatchOut)
def update_catch(
    catch_id: int,
    data: schemas.CatchUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    catch = db.query(models.Catch).filter(models.Catch.id == catch_id).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Улов не найден")
    if catch.owner_id != current_user.id and current_user.role != models.UserRole.inspector:
        raise HTTPException(status_code=403, detail="Нет доступа")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(catch, field, value)
    db.commit()
    db.refresh(catch)
    return catch


@router.delete("/{catch_id}", status_code=204)
def delete_catch(
    catch_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    catch = db.query(models.Catch).filter(models.Catch.id == catch_id).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Улов не найден")
    if catch.owner_id != current_user.id and current_user.role != models.UserRole.inspector:
        raise HTTPException(status_code=403, detail="Нет доступа")
    db.delete(catch)
    db.commit()


# ── Fisher's own catches ──────────────────────────────

@router.get("/my/list", response_model=List[schemas.CatchOut])
def my_catches(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Catch)
        .filter(models.Catch.owner_id == current_user.id)
        .order_by(models.Catch.created_at.desc())
        .all()
    )
