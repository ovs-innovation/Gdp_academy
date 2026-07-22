# Run once in PowerShell AS ADMINISTRATOR so phones on same Wi-Fi can open the dev site.
# Right-click PowerShell -> Run as administrator, then:
#   cd C:\Users\drist\Gdp_academy
#   .\scripts\allow-dev-firewall.ps1

$ErrorActionPreference = "Stop"
$ports = @(3000, 8080, 8096)
$names = @{
  3000 = "GDP Dev Website frontend"
  8080 = "GDP Dev Admin"
  8096 = "GDP Dev Backend API"
}

foreach ($port in $ports) {
  $ruleName = $names[$port]
  $existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "Already allowed: $ruleName (port $port)"
    continue
  }
  New-NetFirewallRule `
    -DisplayName $ruleName `
    -Direction Inbound `
    -LocalPort $port `
    -Protocol TCP `
    -Action Allow `
    -Profile Private, Domain | Out-Null
  Write-Host "Allowed inbound TCP port $port - $ruleName"
}

Write-Host ""
Write-Host "Done. Restart npm run dev, then open the Network URL on your phone."
