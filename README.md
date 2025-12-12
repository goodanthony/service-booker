# ServiceBooker

A full-stack booking platform (Next.js + NestJS) where service providers publish availability and customers book time slots (with double-booking protection).

## Stack

- **Frontend:** Next.js (TypeScript, App Router)
- **Backend:** NestJS (TypeScript)
- **DB:** PostgreSQL (Prisma ORM + pg adapter)

## Local Development (Docker)

From the repo root:
```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001 (mapped to container port 3000)

## Database Connection (RDS / Verified TLS)

This project supports best-practice TLS verification for AWS RDS by using the public AWS RDS CA bundle.

### 1. Download the AWS RDS CA bundle

From the repo root:
```bash
mkdir -p backend/certs

# Region bundle (Sydney / ap-southeast-2)
curl -sS "https://truststore.pki.rds.amazonaws.com/ap-southeast-2/ap-southeast-2-bundle.pem" \
  -o backend/certs/rds-ca.pem

# OR global bundle (works across commercial regions)
curl -sS "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem" \
  -o backend/certs/rds-ca.pem
```

> `backend/certs/rds-ca.pem` is not a secret — it's a public CA bundle used to verify the RDS server certificate.

### 2. Configure backend env

Create `backend/.env` (do not commit this file):
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/service_booker_dev?sslmode=require
PG_SSL_CA_PATH=certs/rds-ca.pem
```

### 3. Generate Prisma client (Prisma 7)

From `backend/`:
```bash
npx prisma generate --config ./prisma.config.ts
```

If you see `Cannot find module .../generated/prisma/client`, it usually means the client hasn't been generated yet, or the import path doesn't match the file location.

## Troubleshooting

### "ENOENT: no such file or directory, certs/rds-ca.pem"

You haven't downloaded the CA bundle yet. Run the download command above, or unset `PG_SSL_CA_PATH` if you're not using RDS.

### "Cannot find module '../generated/prisma/client'"

Run:
```bash
cd backend
npx prisma generate --config ./prisma.config.ts
```