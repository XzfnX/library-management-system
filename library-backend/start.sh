#!/bin/bash

echo "========================================"
echo "  图书管理系统后端启动脚本"
echo "========================================"
echo ""

cd "$(dirname "$0")/library-backend"

echo "[1/3] 正在编译项目..."
mvn clean compile -DskipTests
if [ $? -ne 0 ]; then
    echo "编译失败！"
    exit 1
fi

echo ""
echo "[2/3] 正在打包项目..."
mvn package -DskipTests
if [ $? -ne 0 ]; then
    echo "打包失败！"
    exit 1
fi

echo ""
echo "[3/3] 正在启动服务器..."
echo "启动成功后请访问:"
echo "  - API文档: http://localhost:8080/doc.html"
echo "  - H2数据库: http://localhost:8080/api/h2-console"
echo ""

mvn spring-boot:run
