# VENTRY - Control de Acceso

Aplicación web para el control de entradas y salidas del alumnado en conserjería.

* **Frontend:** React 18 + TypeScript + Vite (SPA) servida por Nginx
* **Backend:** Node.js 20 + Express + Prisma ORM (API REST `/api/v1`)
* **Base de datos:** PostgreSQL 16
* **Infraestructura:** Docker Compose

La arquitectura completa está documentada en [`DOCS/ARCHITECTURE.md`](DOCS/ARCHITECTURE.md).

## Requisitos
* Docker y Docker Compose v2 instalados.

## Pasos para ejecutar en local
1. Clonar el repositorio:
   `git clone https://github.com/nacherdev/Ventry.git`
2. Entrar al directorio:
   `cd Ventry`
3. Crear el archivo de variables de entorno a partir de la plantilla:
   `cp .env.example .env`
4. (Opcional) Cambiar las credenciales en el archivo `.env`.
5. Construir y levantar los contenedores:
   `docker compose up --build`
6. Abrir <http://localhost:8080>. La API responde en <http://localhost:8080/api/v1/health>.

Para borrar la base de datos y volver a sembrarla: `docker compose down -v && docker compose up --build`.
