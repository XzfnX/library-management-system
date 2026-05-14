# 图书管理系统 - 快速启动指南

## 系统要求

- JDK 17+
- MySQL 8.0+
- Maven 3.8+
- Node.js 18+
- npm 或 yarn

---

## 方式一：Docker 部署（推荐）

### 1. 启动所有服务

```bash
# 在项目根目录下执行
docker-compose up -d
```

### 2. 访问系统

- 前端页面: http://localhost
- 后端 API: http://localhost:8080
- API 文档: http://localhost:8080/doc.html

---

## 方式二：手动部署

### 后端部署

#### 1. 创建数据库

```bash
mysql -u root -p
```

```sql
CREATE DATABASE library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE library;
```

#### 2. 执行初始化脚本

```bash
# 进入后端目录
cd library-backend

# 执行 SQL 脚本
mysql -u root -p library < src/main/resources/sql/init.sql
```

#### 3. 修改数据库配置

编辑 `library-backend/src/main/resources/application-dev.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/library?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false
    username: your_username
    password: your_password
```

#### 4. 编译并运行

```bash
cd library-backend

# 编译打包
mvn clean package -DskipTests

# 运行应用
java -jar target/library-backend-1.0.0.jar
```

### 前端部署

#### 1. 安装依赖

```bash
npm install
```

#### 2. 安装 Axios

```bash
npm install axios
```

#### 3. 配置环境变量

创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:8080/api
```

#### 4. 启动开发服务器

```bash
npm run dev
```

#### 5. 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录，可以部署到 Nginx。

---

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 测试用户 | testuser | admin123 |

---

## API 接口说明

### 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/register | 用户注册 |
| GET | /api/auth/current | 获取当前用户 |
| POST | /api/auth/logout | 用户登出 |

### 图书接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/books | 获取图书列表 |
| GET | /api/books/{id} | 获取图书详情 |
| POST | /api/books | 添加图书 |
| PUT | /api/books/{id} | 更新图书 |
| DELETE | /api/books/{id} | 删除图书 |

### 书架接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/shelves | 获取我的书架 |
| POST | /api/shelves | 创建书架 |
| PUT | /api/shelves/{id} | 更新书架 |
| DELETE | /api/shelves/{id} | 删除书架 |

### 借阅接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/borrows/my | 我的借阅记录 |
| POST | /api/borrows | 借阅图书 |
| PUT | /api/borrows/{id}/return | 归还图书 |
| PUT | /api/borrows/{id}/renew | 续借图书 |

### 管理员接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/users | 用户列表 |
| PUT | /api/admin/users/{id}/status | 更新用户状态 |
| GET | /api/admin/books | 所有图书 |
| GET | /api/admin/borrows | 所有借阅记录 |
| GET | /api/admin/statistics | 数据统计 |

---

## 技术架构

```
┌─────────────────┐
│   前端 (React) │
│  Vite + TS     │
└────────┬────────┘
         │ HTTP
         │
┌────────▼────────┐
│  后端 (Spring Boot)
│  JWT + Security │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│ MySQL  │ │ Swagger
│ 8.0   │ │ API Docs
└───────┘ └───────┘
```

---

## 常见问题

### 1. 数据库连接失败

- 检查 MySQL 是否启动
- 确认数据库用户名密码正确
- 确认数据库 `library` 已创建

### 2. 前端无法访问后端

- 确认后端服务已启动（端口 8080）
- 检查跨域配置是否正确
- 检查前端环境变量 `VITE_API_URL` 配置

### 3. JWT Token 过期

- 登录状态默认 24 小时
- 重新登录即可获取新 Token

---

## 更多信息

- 后端详细文档: [library-backend/README.md](library-backend/README.md)
- 技术架构文档: [.trae/documents/完整技术架构文档-图书管理系统.md](.trae/documents/完整技术架构文档-图书管理系统.md)
- 需求文档: [.trae/documents/完整项目需求文档-图书管理系统.md](.trae/documents/完整项目需求文档-图书管理系统.md)
