#!/bin/sh
# Aplica migraciones versionadas y la semilla antes de arrancar la API.
set -e
npx prisma migrate deploy
node prisma/seed.js
exec "$@"
