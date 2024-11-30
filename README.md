# Opti Diagnose

## Running the project
1. Create `.env` file in the root directory and add the following environment variables:

```
DEBUG=True
SECRET_KEY='abcdefghijklmnopqrstuvwxyz1234567890'
ALLOWED_HOSTS=*
DATABASE_URL=postgres://postgres:secretpassword@postgres:5432/optidiagnosedb

POSTGRES_USER=postgres
POSTGRES_PASSWORD=secretpassword
POSTGRES_DB=optidiagnosedb
```

2. Run using Docker Compose:

```
docker compose up
```

Runs:
- frontend on `5173`
- backend on `8080`
- postgres on `54320`

# Backend

```
cd backend
```

## Migrations
To apply migrations, run:

```
docker exec opti-diagnose-api uv run optidiagnose/manage.py makemigrations
docker exec opti-diagnose-api uv run optidiagnose/manage.py migrate
```

## Formatting
```
docker exec opti-diagnose-api uv tool run ruff format
```