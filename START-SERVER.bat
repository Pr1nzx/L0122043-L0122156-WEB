@echo off
REM ============================================
REM Alzheimer Decision Support System - Server Startup
REM ============================================

cd /d "e:\COLLEGE\SEMESTER 7\Semantic\project\L0122043_L0122156-WEB\L0122043-L0122156-WEB\backendJAVA\backend"

echo.
echo ===================================
echo   STARTING BACKEND SERVER
echo ===================================
echo.
echo Server akan berjalan di: http://localhost:8080/api
echo.
echo Tunggu sampai muncul: "Started AlzheimerBackendApplication"
echo.

java -jar target/alzheimer-backend-1.0.0.jar

echo.
echo === SERVER STOPPED ===
echo.
pause
