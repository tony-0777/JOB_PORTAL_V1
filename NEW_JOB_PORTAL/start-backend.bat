@echo off
cd /d "%~dp0\backend"
echo ========================================================
echo  Starting JobPortalPro Spring Boot Backend (http://localhost:8080)
echo ========================================================
call mvnw.cmd spring-boot:run
pause
