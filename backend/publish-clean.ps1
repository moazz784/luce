# Clean publish: deletes ./publish then dotnet publish Luce.Api (Release).
$ErrorActionPreference = "Stop"

$backendRoot = $PSScriptRoot
$publishDir = Join-Path $backendRoot "publish"
$apiProject = Join-Path (Join-Path $backendRoot "Luce.Api") "Luce.Api.csproj"

if (Test-Path $publishDir) {
    Write-Host "Removing existing publish folder: $publishDir"
    Remove-Item -LiteralPath $publishDir -Recurse -Force
}

Write-Host "Publishing to: $publishDir"
dotnet publish $apiProject -c Release -o $publishDir

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "Done."
