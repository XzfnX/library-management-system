@echo off
REM 图书管理系统后端启动脚本
REM 请确保已安装 Java 21 或更高版本（但低于 Java 26）

echo =============================================
echo   图书管理系统后端启动脚本
echo =============================================
echo.

REM 检查 Java 版本
java -version 2>&1 | findstr "version"
echo.

REM 检查 Java 版本号
for /f "tokens=3" %%i in ('java -version 2^>^&1 ^| findstr /C:"version"') do (
    set JAVA_VERSION=%%i
)

echo 当前 Java 版本: %JAVA_VERSION%
echo.

REM 检查是否是 Java 26
echo %JAVA_VERSION% | findstr "26" >nul
if %errorlevel% equ 0 (
    echo =============================================
    echo   警告: 检测到 Java 26
    echo   当前 Spring Boot 版本不支持 Java 26
    echo   请降级到 Java 21 或 22
    echo =============================================
    echo.
    echo 可选方案:
    echo   1. 安装 Java 21
    echo   2. 等待 Spring Boot 更新支持 Java 26
    echo   3. 使用 Docker 运行后端
    echo.
    pause
    exit /b 1
)

echo 正在启动后端服务...
echo.

cd /d "%~dp0"
mvn exec:java

echo.
echo 按任意键退出...
pause >nul
