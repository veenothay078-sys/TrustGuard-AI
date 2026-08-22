$body = @{ text = "URGENT: Your bank account has been suspended. Verify your OTP now!" } | ConvertTo-Json
$res = Invoke-RestMethod -Uri "http://localhost:5000/api/analyze/text" -Method Post -Body $body -ContentType "application/json"
Write-Host "Risk Score: $($res.riskScore)"
Write-Host "Risk Level: $($res.riskLevel)"
Write-Host "Categories: $($res.categories -join ', ')"
Write-Host "IsDemo: $($res.isDemo)"
Write-Host "Summary: $($res.summary.Substring(0, [Math]::Min(100, $res.summary.Length)))..."
