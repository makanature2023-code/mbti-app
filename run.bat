@echo off
cd /d %~dp0
start http://localhost:8080
start "" /min node server.js