# 图书管理系统 - 启动脚本

@echo off
echo ========================================
echo   图书管理系统后端启动脚本
echo ========================================
echo.

cd /d "%~dp0library-backend"

echo [1/3] 正在编译项目...
call mvn clean compile -DskipTests
if %errorlevel% neq 0 (
    echo 编译失败！
    pause
    exit /b 1
)

echo.
echo [2/3] 正在打包项目...
call mvn package -DskipTests
if %errorlevel% neq 0 (
    echo 打包失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 正在启动服务器...
echo 启动成功后请访问:
echo   - API文档: http://localhost:8080/doc.html
echo   - H2数据库: http://localhost:8080/api/h2-console
echo.
call mvn spring-boot:run

pause
