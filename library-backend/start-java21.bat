@echo off
chcp 65001 >nul
echo =============================================
echo   图书管理系统后端启动脚本 (Java 21)
echo =============================================
echo.

set "JAVA_HOME=d:\lenovo\Documents\jdk21-extracted\jdk-21.0.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo 正在检查 Java 版本...
java -version
echo.

cd /d "%~dp0"
echo 正在启动后端服务...
echo.

call mvn clean compile exec:java

echo.
pause
