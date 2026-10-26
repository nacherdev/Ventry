# VENTRY - Control de Acceso

## Requisitos
* Docker y Docker Compose instalados.

## Pasos para ejecutar en local
1. Clonar el repositorio:
   `git clone [URL_DE_TU_REPO]`
2. Entrar al directorio:
   `cd ventry`
3. Crear el archivo de variables de entorno a partir de la plantilla:
   `cp .env.example .env`
4. Rellenar los datos en el archivo `.env`.
5. Levantar los contenedores:
   `docker-compose up -d`