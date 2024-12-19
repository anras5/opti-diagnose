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