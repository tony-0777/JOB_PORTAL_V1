@echo off
set "PATH=%PATH%;C:\Users\BHUMI\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;C:\Program Files\nodejs"
cd /d "%~dp0\frontend"
echo ========================================================
echo  Starting JobPortalPro Angular Frontend (http://localhost:4200)
echo ========================================================
call npm start
pause
