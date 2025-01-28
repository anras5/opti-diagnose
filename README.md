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

2. Download `.mar` model archive files from [releases page](https://github.com/anras5/opti-diagnose/releases)

3. Put the `.mar` files inside `models/model_store` directory

4. Run using Docker Compose:

```
docker compose up
```

5. If running for the first time:

```shell
docker exec -it opti-diagnose-api uv run optidiagnose/manage.py createsuperuser
```
Username and password specified here can be used to login to the app.

If you would like to add additional users you can do it using `localhost:8088/admin` or using api `localhost:8088/api/user/`

Runs:
- frontend on `5173`
- backend on `8088` (use /admin to access admin panel)
- postgres on `54320`
- pytorch serve on `8080`, `8081`, `8082`
