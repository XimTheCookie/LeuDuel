@echo off
docker compose -f docker-compose.android-release.yml --env-file release.env up --build --remove-orphans
pause
