@echo off
echo ========================================
echo Mission Control Dashboard
echo ========================================
echo.
echo Starting Convex and Next.js servers...
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

start "Convex Dev Server" cmd /k "npx convex dev"
timeout /t 5 /nobreak > nul
start "Next.js Dev Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers starting in separate windows...
echo Close this window when done
echo ========================================
