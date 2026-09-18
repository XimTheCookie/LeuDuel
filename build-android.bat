@echo off
docker compose -f docker-compose.android.yml up --build --remove-orphans
pause