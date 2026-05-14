# 图书管理系统后端

## 项目简介

基于 Spring Boot 3.2 + MyBatis-Plus + MySQL 的图书管理系统后端 API 服务。

## 技术栈

- **框架**: Spring Boot 3.2
- **ORM**: MyBatis-Plus 3.5
- **数据库**: MySQL 8.0
- **认证**: JWT + Spring Security
- **API文档**: Knife4j (Swagger)
- **构建工具**: Maven

## 环境要求

- JDK 17+
- MySQL 8.0+
- Maven 3.8+

## 快速开始

### 1. 数据库配置

```bash
mysql -u root -p
```

```sql
CREATE DATABASE library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE library;
```

执行数据库初始化脚本：

```bash
mysql -u root -p library < src/main/resources/sql/init.sql
```

### 2. 修改配置文件

编辑 `src/main/resources/application-dev.yml`，修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/library?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

### 3. 编译运行

```bash
# 编译项目
mvn clean package -DskipTests

# 运行项目
mvn spring-boot:run
```

或直接运行 jar 包：

```bash
java -jar target/library-backend-1.0.0.jar
```

## API 文档

启动项目后访问：

- Swagger UI: http://localhost:8080/swagger-ui/index.html
- Knife4j: http://localhost:8080/doc.html

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 测试用户 | testuser | admin123 |

## 主要功能

- ✅ 用户认证（登录/注册/JWT Token）
- ✅ 图书管理（增删改查/搜索筛选）
- ✅ 书架管理（创建/编辑/删除书架）
- ✅ 借阅管理（借书/还书/续借）
- ✅ 评论评分（评论/评分系统）
- ✅ 分类管理（系统预设分类）
- ✅ 管理员后台（用户管理/数据统计）

## 项目结构

```
src/main/java/com/library/
├── common/          # 公共响应类
├── config/          # 配置类
├── controller/      # 控制器层
├── dto/            # 数据传输对象
├── entity/         # 实体类
├── exception/      # 异常处理
├── filter/         # JWT过滤器
├── mapper/         # 数据访问层
├── service/        # 业务层
├── utils/          # 工具类
└── vo/            # 视图对象
```

## 接口前缀

所有接口前缀: `/api`

示例:

- 登录: `POST /api/auth/login`
- 图书列表: `GET /api/books`
- 借阅图书: `POST /api/borrows`

## License

MIT License
