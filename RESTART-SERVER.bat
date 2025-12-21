@echo off
REM ============================================
REM Alzheimer Decision Support System - Server Restart
REM ============================================

echo.
echo ===================================
echo   RESTARTING BACKEND SERVER
echo ===================================
echo.

REM Step 1: Stop any running Java processes
echo [1/3] Menghentikan server lama...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak

REM Step 2: Navigate to backend directory
cd /d "e:\COLLEGE\SEMESTER 7\Semantic\project\L0122043_L0122156-WEB\L0122043-L0122156-WEB\backendJAVA\backend"

REM Step 3: Start fresh build
echo [2/3] Rebuild aplikasi (ini ambil 30-60 detik)...
call mvn clean package -DskipTests -q
if %errorlevel% neq 0 (
    echo ERROR: Build gagal!
    pause
    exit /b 1
)

REM Step 4: Start server
echo [3/3] Menjalankan server...
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
