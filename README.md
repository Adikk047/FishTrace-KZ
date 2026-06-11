# 🐟 FishTrace KZ

Цифровая платформа для учёта улова рыбы и прямой продажи покупателям.

## Стек технологий

| Слой | Технология |
|------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | FastAPI (Python 3.10+) |
| База данных | SQLite (через SQLAlchemy) |
| Аутентификация | JWT (jose) |
| QR-коды | qrcode[pil] |

---

## 🚀 Запуск проекта

### Требования

- Python 3.10+
- Node.js 18+
- npm или yarn

---

### 1. Бэкенд (FastAPI)

```bash
cd fishtrace-kz/backend

# Создать виртуальное окружение
python -m venv venv

# Активировать:
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# (Опционально) Создать демо-данные
python seed.py

# Запустить сервер
uvicorn main:app --reload --port 8000
```

API будет доступен на: http://localhost:8000  
Документация Swagger: http://localhost:8000/docs

---

### 2. Фронтенд (React + Vite)

```bash
cd fishtrace-kz/frontend

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Приложение откроется на: http://localhost:5173

---

## 👥 Роли и демо-аккаунты

| Роль | Email | Пароль | Возможности |
|------|-------|--------|-------------|
| 🎣 Рыбак | fisher@demo.kz | demo123 | Добавление улова, просмотр своих записей |
| 🛒 Покупатель | buyer@demo.kz | demo123 | Просмотр рынка, поиск, связь с рыбаком |
| 🔍 Инспектор | inspector@demo.kz | demo123 | Все записи, фильтрация, статистика |

---

## 📄 API Эндпоинты

### Аутентификация
| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/auth/register | Регистрация |
| POST | /api/auth/login | Вход |
| GET | /api/auth/me | Текущий пользователь |

### Уловы
| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/catches/ | Список уловов (с фильтрами) |
| POST | /api/catches/ | Создать улов 🔐 |
| GET | /api/catches/{id} | Карточка улова |
| PUT | /api/catches/{id} | Обновить улов 🔐 |
| DELETE | /api/catches/{id} | Удалить улов 🔐 |
| GET | /api/catches/my/list | Мои уловы 🔐 |
| GET | /api/catches/{id}/qr | QR-код |

**Фильтры GET /api/catches/:**
- `fish_type` — вид рыбы
- `status` — available / sold
- `date_from` — дата от (YYYY-MM-DD)
- `date_to` — дата до (YYYY-MM-DD)

---

## 📁 Структура проекта

```
fishtrace-kz/
├── backend/
│   ├── main.py          # FastAPI app, CORS, роуты
│   ├── models.py        # SQLAlchemy модели
│   ├── schemas.py       # Pydantic схемы
│   ├── database.py      # SQLite подключение
│   ├── auth.py          # JWT, хэширование паролей
│   ├── seed.py          # Демо-данные
│   ├── routers/
│   │   ├── auth.py      # /api/auth/*
│   │   └── catches.py   # /api/catches/*
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/client.js        # Axios + токен
        ├── context/AuthContext  # Глобальное состояние auth
        ├── components/
        │   ├── Navbar.jsx
        │   ├── CatchCard.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx    # Личный кабинет
            ├── AddCatch.jsx     # Форма улова + QR
            ├── Market.jsx       # Рынок с поиском
            ├── CatchDetail.jsx  # Карточка улова
            └── Admin.jsx        # Панель инспектора
```

---

## 🏗️ Продакшн сборка

```bash
# Frontend build
cd frontend
npm run build

# Сервить статику через FastAPI
# Добавить в main.py:
# app.mount("/", StaticFiles(directory="../frontend/dist", html=True))
```
