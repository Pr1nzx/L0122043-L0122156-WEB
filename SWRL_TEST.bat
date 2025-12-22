@echo off
REM Wait for server
echo Waiting for server to start...
timeout /t 3 /nobreak

echo.
echo Testing Step 1: Create Patient
echo.

curl -X POST "http://127.0.0.1:8080/api/v1/diagnosis/step1" ^
  -H "Content-Type: application/json" ^
  -d "{\"age\":72,\"mmseScore\":18,\"hasFamilyHistory\":true,\"brainImagingType\":\"MRI\",\"behavioralSymptoms\":true,\"sleepDisorders\":false,\"apoeGenotype\":\"e3e4\",\"clinicalNotes\":\"Memory loss\"}"

echo.
echo Test complete!
pause
