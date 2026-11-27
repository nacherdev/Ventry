-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "system_status" (
    "id" SERIAL NOT NULL,
    "message" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumnos" (
    "id" SERIAL NOT NULL,
    "nia" VARCHAR(20) NOT NULL,
    "dni" VARCHAR(12),
    "nombre" VARCHAR(80) NOT NULL,
    "apellidos" VARCHAR(120) NOT NULL,
    "curso" VARCHAR(40) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "qr_token" UUID NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_nia_key" ON "alumnos"("nia");

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_dni_key" ON "alumnos"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_qr_token_key" ON "alumnos"("qr_token");

-- CreateIndex
CREATE INDEX "alumnos_apellidos_nombre_idx" ON "alumnos"("apellidos", "nombre");

