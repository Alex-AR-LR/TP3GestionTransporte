# TP3 - Gestión de vehículos, conductores y viajes

## Base de datos

Ejecutar `backend/sql/schema.sql` en MySQL (crea `transporte_db` y las tablas).

## Backend

```bash
cd backend
cp .env.example .env   # completar DB_PASSWORD y JWT_SECRET
npm install
npm run dev            # http://localhost:3000
```

Editar `.env` con el usuario y la contraseña de MySQL (`DB_USER`, `DB_PASSWORD`) y un valor cualquiera para `JWT_SECRET`. Si MySQL corre en Docker, usar `DB_HOST=127.0.0.1` y el puerto publicado en `DB_PORT`.

Pruebas de la API: carpeta `backend/http/` (extensión REST Client de VS Code).

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```
