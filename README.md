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

2. Download `vgg.mar` model archive file from [releases page](https://github.com/anras5/opti-diagnose/releases)

3. Put the `vgg.mar` file inside `models/model_store` directory

4. Run using Docker Compose:

```
docker compose up
```

Runs:
- frontend on `5173`
- backend on `8080`
- postgres on `54320`
- pytorch serve on `8081`, `8082`, `8083`
