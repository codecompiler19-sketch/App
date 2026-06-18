# Safe Copy Script for CodesCompiler
# This script copies your code from the App folder (subdomain/test) to your production folder (codescompiler.com)
# It automatically excludes .git, .github, node_modules, dist, .astro, and the CNAME file.
# This prevents mixing up Git histories and breaking domain settings!

$Source = $PSScriptRoot
if (-not $Source) {
    $Source = Get-Location
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    CODESCOMPILER SAFE COPY TOOL" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Source: $Source"

# Detect possible production folders
$PossibleTargets = @(
    "C:\Users\Computer\Desktop\github\New_codecompiler\codescompiler",
    "C:\Users\Computer\Desktop\codescompiler.com",
    "C:\Users\Computer\Desktop\website\CodesCompiler\codescompiler"
)

Write-Host "Detected potential production folders on your Desktop:" -ForegroundColor Yellow
$Index = 1
$ValidTargets = @()
foreach ($Target in $PossibleTargets) {
    if (Test-Path $Target) {
        Write-Host "  [$Index] $Target"
        $ValidTargets += $Target
        $Index++
    }
}

Write-Host "  [$Index] Enter custom path manually..."
$Selection = Read-Host "Select the folder to copy files to (enter the number)"

if (-not $Selection) {
    Write-Host "Operation cancelled." -ForegroundColor Red
    Exit
}

$SelectedTarget = ""
if ($Selection -match '^\d+$') {
    $SelInt = [int]$Selection
    if ($SelInt -gt 0 -and $SelInt -le $ValidTargets.Length) {
        $SelectedTarget = $ValidTargets[$SelInt - 1]
    } elseif ($SelInt -eq $Index) {
        $SelectedTarget = Read-Host "Please enter the full folder path"
    }
} else {
    $SelectedTarget = $Selection
}

if (-not (Test-Path $SelectedTarget)) {
    Write-Host "Target folder '$SelectedTarget' does not exist!" -ForegroundColor Red
    Exit
}

Write-Host "`nTarget Folder: $SelectedTarget" -ForegroundColor Green
$Confirm = Read-Host "Are you sure you want to copy files from testing to production? (y/n)"
if ($Confirm -ne 'y' -and $Confirm -ne 'Y') {
    Write-Host "Cancelled." -ForegroundColor Red
    Exit
}

Write-Host "Copying files safely using robocopy..." -ForegroundColor Yellow

# Run robocopy to copy all files recursively
# XD excludes directories: .git, .github, node_modules, dist, .astro
# XF excludes files: CNAME, safe-copy.ps1
robocopy "$Source" "$SelectedTarget" /E /XD .git .github node_modules dist .astro /XF CNAME safe-copy.ps1

Write-Host "`nCopy completed successfully!" -ForegroundColor Green
Write-Host "Your domain configurations (CNAME files) and git settings (.git folders) remain unaffected." -ForegroundColor Green
Read-Host "Press Enter to exit..."
