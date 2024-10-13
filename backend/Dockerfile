FROM python:3.12-slim-bookworm
LABEL authors="filipmarciniak"

# install uv
COPY --from=ghcr.io/astral-sh/uv:0.4.20 /uv /bin/uv

# create the project with uv
WORKDIR /app
COPY . .
RUN uv sync --frozen

EXPOSE 8080

CMD ["sh", "-c", "cd optidiagnose && uv run manage.py runserver 0.0.0.0:8080"]