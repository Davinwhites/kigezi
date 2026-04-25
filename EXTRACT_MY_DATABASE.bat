@echo off
echo ==========================================
echo    TUGYENDANE KIGEZI - DATA EXTRACTOR
echo ==========================================
echo.
echo Connecting to Cloud Database...
node backup_data.js
echo.
echo ==========================================
echo Extraction Complete! 
echo Check the "database_backup" folder.
echo ==========================================
pause
