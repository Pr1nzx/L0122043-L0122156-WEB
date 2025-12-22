#!/usr/bin/env powershell
# Simple HTTP GET test without content

$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:8080/api/actuator/health" `
            -Method Get `
            -TimeoutSec 5 `
            -UseBasicParsing `
            -ErrorAction Stop
        
        Write-Host "SUCCESS! Server responded with status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Green
        break
    } catch [System.Net.WebException] {
        $attempt++
        Write-Host "Attempt $attempt/$maxAttempts - Server not ready yet. Retrying in 1 second..."
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        break
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "Server did not respond after $maxAttempts attempts" -ForegroundColor Red
    exit 1
}
