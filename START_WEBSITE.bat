@echo off
title Tugyedane Kigezi Festival - Launcher
echo Website is moving to Vercel due to Netlify limits...
echo.
echo 1. Opening Local Server (for you)...
echo 2. Opening Production Link (for the world)...
echo.
:: Change the link below once you have your new Vercel URL!
set NEW_URL=https://tugyendanekigezi2026.netlify.app

start http://localhost:5173
start %NEW_URL%
echo.
echo If the top link says "Site Not Available", please update this file 
echo with your new Vercel URL.
pause
