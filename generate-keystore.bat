@echo off
echo This will generate the upload keystore in the ./keys folder.
echo Keep the generated .jks file and passwords in a safe place!
echo.
docker compose -f docker-compose.keytool.yml run --rm keytool
pause
