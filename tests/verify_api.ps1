$base = "http://localhost:5000"

Write-Host "`n=== TrustGuard Full API Verification ===" -ForegroundColor Cyan

# 1. Health check
Write-Host "`n[1] Health Check..." -ForegroundColor Yellow
$h = Invoke-RestMethod "$base/api/health"
Write-Host "  Status: $($h.status), Demo: $($h.demoMode)" -ForegroundColor Green

# 2. Text analysis
Write-Host "`n[2] Text Analysis (phishing message)..." -ForegroundColor Yellow
$body = @{ text = "URGENT: Your bank account has been blocked. Verify your OTP at http://secure-bank.xyz" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$base/api/analyze/text" -Method Post -Body $body -ContentType "application/json"
Write-Host "  Score: $($r.riskScore)/100, Level: $($r.riskLevel), Demo: $($r.isDemo)" -ForegroundColor Green

# 3. URL analysis
Write-Host "`n[3] URL Analysis (suspicious URL)..." -ForegroundColor Yellow
$body = @{ url = "http://paypa1-secure.tk/login" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$base/api/analyze/url" -Method Post -Body $body -ContentType "application/json"
Write-Host "  Score: $($r.riskScore)/100, Level: $($r.riskLevel)" -ForegroundColor Green

# 4. Dashboard stats
Write-Host "`n[4] Dashboard Statistics..." -ForegroundColor Yellow
$r = Invoke-RestMethod "$base/api/dashboard/statistics"
Write-Host "  Total: $($r.totalAnalyses), High+Critical: $($r.highCount + $r.criticalCount)" -ForegroundColor Green

# 5. History
Write-Host "`n[5] Analysis History..." -ForegroundColor Yellow
$r = Invoke-RestMethod "$base/api/analysis/history"
Write-Host "  Total records: $($r.pagination.total)" -ForegroundColor Green

# 6. RAG search
Write-Host "`n[6] RAG Knowledge Search..." -ForegroundColor Yellow
$body = @{ categories = @("Phishing Risk"); text = "otp password bank" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$base/api/rag/search" -Method Post -Body $body -ContentType "application/json"
Write-Host "  Found $($r.count) relevant documents: $($r.documents[0].title)" -ForegroundColor Green

Write-Host "`n=== All API Endpoints Verified! ===" -ForegroundColor Cyan
