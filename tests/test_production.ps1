$backendUrl = "https://backend-two-mu-84.vercel.app"

Write-Host "=== TEST 1: Health Check ==="
$h = Invoke-RestMethod -Uri "$backendUrl/api/health" -Method Get
$h | ConvertTo-Json

Write-Host "`n=== TEST 2: Scam Text Analysis ==="
$body = @{ text = "URGENT: Your Bank of America account has been temporarily locked. Please verify your identity and OTP immediately: http://paypal-security-update.tk" } | ConvertTo-Json
$res = Invoke-RestMethod -Uri "$backendUrl/api/analyze/text" -Method Post -Body $body -ContentType "application/json"
$res | ConvertTo-Json -Depth 5

Write-Host "`n=== TEST 3: Safe Text Analysis ==="
$body2 = @{ text = "Hi John, could you please review the meeting minutes from yesterday when you get a chance? Thanks!" } | ConvertTo-Json
$res2 = Invoke-RestMethod -Uri "$backendUrl/api/analyze/text" -Method Post -Body $body2 -ContentType "application/json"
$res2 | ConvertTo-Json -Depth 5

Write-Host "`n=== TEST 4: URL Analysis ==="
$urlBody = @{ url = "http://192.168.1.1/login-bank.php?update=true" } | ConvertTo-Json
$resUrl = Invoke-RestMethod -Uri "$backendUrl/api/analyze/url" -Method Post -Body $urlBody -ContentType "application/json"
$resUrl | ConvertTo-Json -Depth 5

Write-Host "`n=== TEST 5: RAG Search ==="
$ragBody = @{ categories = @("Phishing Risk"); text = "fake login page credential theft" } | ConvertTo-Json
$resRag = Invoke-RestMethod -Uri "$backendUrl/api/rag/search" -Method Post -Body $ragBody -ContentType "application/json"
$resRag | ConvertTo-Json -Depth 5

Write-Host "`n=== TEST 6: AI Chat ==="
$chatBody = @{ message = "What are the key indicators of a scam?" } | ConvertTo-Json
$resChat = Invoke-RestMethod -Uri "$backendUrl/api/chat" -Method Post -Body $chatBody -ContentType "application/json"
$resChat | ConvertTo-Json -Depth 5

