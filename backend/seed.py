"""
Скрипт для создания демо-данных.
Запускать из директории backend/: python seed.py
"""
import sys
sys.path.insert(0, '.')

from database import SessionLocal, engine
import models
from auth import hash_password

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Проверяем, есть ли уже данные
if db.query(models.User).count() > 0:
    print("Данные уже существуют. Пропускаем.")
    db.close()
    sys.exit(0)

# Создаём пользователей
users = [
    models.User(
        full_name="Алибек Рыбаков",
        email="fisher@demo.kz",
        phone="+7 777 111 22 33",
        hashed_password=hash_password("demo123"),
        role=models.UserRole.fisher,
    ),
    models.User(
        full_name="Дана Сатпаева",
        email="buyer@demo.kz",
        phone="+7 707 444 55 66",
        hashed_password=hash_password("demo123"),
        role=models.UserRole.buyer,
    ),
    models.User(
        full_name="Марат Инспекторов",
        email="inspector@demo.kz",
        phone="+7 705 777 88 99",
        hashed_password=hash_password("demo123"),
        role=models.UserRole.inspector,
    ),
    models.User(
        full_name="Серик Балхашев",
        email="fisher2@demo.kz",
        phone="+7 778 222 33 44",
        hashed_password=hash_password("demo123"),
        role=models.UserRole.fisher,
    ),
]

for u in users:
    db.add(u)
db.commit()
for u in users:
    db.refresh(u)

print(f"✓ Создано {len(users)} пользователей")

# Создаём улов для первого рыбака
catches = [
    models.Catch(fish_type="Карп",   weight_kg=12.5, location="Балхаш, северный берег",   catch_date="2024-06-10", price_per_kg=1200, phone="+7 777 111 22 33", description="Свежий, охлаждённый. Пойман утром.", status="available", owner_id=users[0].id),
    models.Catch(fish_type="Судак",  weight_kg=8.0,  location="Капчагайское водохранилище", catch_date="2024-06-09", price_per_kg=2500, phone="+7 777 111 22 33", description="Крупный судак.",                  status="available", owner_id=users[0].id),
    models.Catch(fish_type="Щука",   weight_kg=5.5,  location="р. Сырдарья",               catch_date="2024-06-08", price_per_kg=1800, phone="+7 777 111 22 33", description=None,                              status="sold",      owner_id=users[0].id),
    models.Catch(fish_type="Сазан",  weight_kg=20.0, location="Аральское море",             catch_date="2024-06-10", price_per_kg=900,  phone="+7 778 222 33 44", description="Свежий сазан, большая партия.",   status="available", owner_id=users[3].id),
    models.Catch(fish_type="Форель", weight_kg=3.2,  location="р. Или",                    catch_date="2024-06-10", price_per_kg=4500, phone="+7 778 222 33 44", description="Радужная форель.",                status="available", owner_id=users[3].id),
    models.Catch(fish_type="Лещ",    weight_kg=15.0, location="Балхаш, восточная часть",    catch_date="2024-06-07", price_per_kg=700,  phone="+7 777 111 22 33", description=None,                              status="available", owner_id=users[0].id),
]

for c in catches:
    db.add(c)
db.commit()
for c in catches:
    db.refresh(c)

# Генерируем QR-коды
import os, qrcode
os.makedirs("qr_codes", exist_ok=True)

for c in catches:
    url = f"http://localhost:5173/catch/{c.id}"
    img = qrcode.make(url)
    path = f"qr_codes/catch_{c.id}.png"
    img.save(path)
    c.qr_code_path = path

db.commit()
print(f"✓ Создано {len(catches)} уловов с QR-кодами")
print("\n🎣 Демо-аккаунты:")
print("   Рыбак:      fisher@demo.kz    / demo123")
print("   Покупатель: buyer@demo.kz     / demo123")
print("   Инспектор:  inspector@demo.kz / demo123")

db.close()
