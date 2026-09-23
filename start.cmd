@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Устанавливаю зависимости...
  npm install
)
start "mini-figma dev server" cmd /k "npm run dev"
timeout /t 4 /nobreak >nul
start http://localhost:5173