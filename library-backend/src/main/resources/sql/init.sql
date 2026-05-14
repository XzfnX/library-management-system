-- =============================================
-- 图书管理系统数据库初始化脚本
-- 数据库版本: MySQL 8.0+
-- 创建时间: 2024
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `library`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `library`;

-- =============================================
-- 1. 用户表
-- =============================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(BCrypt加密)',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `role` TINYINT NOT NULL DEFAULT 1 COMMENT '角色: 1-普通用户, 2-管理员',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入默认管理员账号 (密码: admin123, BCrypt加密)
INSERT INTO `user` (`username`, `email`, `password`, `role`, `status`)
VALUES ('admin', 'admin@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 2, 1);

-- =============================================
-- 2. 图书表
-- =============================================
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` VARCHAR(200) NOT NULL COMMENT '书名',
  `author` VARCHAR(100) NOT NULL COMMENT '作者',
  `isbn` VARCHAR(20) DEFAULT NULL COMMENT 'ISBN编号',
  `publisher` VARCHAR(100) DEFAULT NULL COMMENT '出版社',
  `publish_date` DATE DEFAULT NULL COMMENT '出版日期',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '图书分类',
  `description` TEXT DEFAULT NULL COMMENT '图书简介',
  `cover_url` VARCHAR(255) DEFAULT NULL COMMENT '封面图片URL',
  `stock` INT NOT NULL DEFAULT 1 COMMENT '库存数量',
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 0.0 COMMENT '平均评分',
  `rating_count` INT NOT NULL DEFAULT 0 COMMENT '评分次数',
  `user_id` BIGINT DEFAULT NULL COMMENT '所属用户ID(个人图书)',
  `is_public` TINYINT NOT NULL DEFAULT 1 COMMENT '是否公开: 0-私有, 1-公开',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_isbn` (`isbn`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category` (`category`),
  KEY `idx_title` (`title`),
  FULLTEXT KEY `ft_search` (`title`, `author`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图书表';

-- =============================================
-- 3. 书架表
-- =============================================
DROP TABLE IF EXISTS `shelf`;
CREATE TABLE `shelf` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(50) NOT NULL COMMENT '书架名称',
  `color` VARCHAR(20) DEFAULT '#3b82f6' COMMENT '书架颜色',
  `user_id` BIGINT NOT NULL COMMENT '所属用户ID',
  `is_default` TINYINT NOT NULL DEFAULT 0 COMMENT '是否默认书架: 0-否, 1-是',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序序号',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='书架表';

-- =============================================
-- 4. 书架图书关联表
-- =============================================
DROP TABLE IF EXISTS `shelf_book`;
CREATE TABLE `shelf_book` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `shelf_id` BIGINT NOT NULL COMMENT '书架ID',
  `book_id` BIGINT NOT NULL COMMENT '图书ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_shelf_book` (`shelf_id`, `book_id`),
  KEY `idx_book_id` (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='书架图书关联表';

-- =============================================
-- 5. 借阅记录表
-- =============================================
DROP TABLE IF EXISTS `borrow_record`;
CREATE TABLE `borrow_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `book_id` BIGINT NOT NULL COMMENT '图书ID',
  `borrow_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '借阅日期',
  `due_date` DATETIME NOT NULL COMMENT '应还日期',
  `return_date` DATETIME DEFAULT NULL COMMENT '实际归还日期',
  `status` VARCHAR(20) NOT NULL DEFAULT 'borrowed' COMMENT '状态: borrowed-借阅中, returned-已归还, overdue-逾期',
  `renew_count` INT NOT NULL DEFAULT 0 COMMENT '续借次数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_book_id` (`book_id`),
  KEY `idx_status` (`status`),
  KEY `idx_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='借阅记录表';

-- =============================================
-- 6. 评论表
-- =============================================
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `book_id` BIGINT NOT NULL COMMENT '图书ID',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `rating` TINYINT DEFAULT NULL COMMENT '评分(1-5星)',
  `parent_id` BIGINT DEFAULT NULL COMMENT '父评论ID(回复)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_book_id` (`book_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- =============================================
-- 7. 图书分类表(系统预设)
-- =============================================
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT '分类图标',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序序号',
  `is_system` TINYINT NOT NULL DEFAULT 0 COMMENT '是否系统预设: 0-否, 1-是',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除: 0-未删除, 1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图书分类表';

-- 插入系统预设分类
INSERT INTO `category` (`name`, `description`, `icon`, `sort_order`, `is_system`) VALUES
('技术', '技术类书籍', 'code', 1, 1),
('文学', '文学类书籍', 'book-open', 2, 1),
('历史', '历史类书籍', 'landmark', 3, 1),
('经济', '经济管理类书籍', 'trending-up', 4, 1),
('设计', '设计类书籍', 'palette', 5, 1),
('哲学', '哲学类书籍', 'lightbulb', 6, 1),
('科学', '科学类书籍', 'flask', 7, 1),
('其他', '其他类书籍', 'folder', 8, 1);

-- =============================================
-- 初始化测试用户数据
-- =============================================
INSERT INTO `user` (`username`, `email`, `password`, `role`, `status`)
VALUES
('testuser', 'test@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1);

-- =============================================
-- 初始化测试图书数据
-- =============================================
INSERT INTO `book` (`title`, `author`, `isbn`, `publisher`, `publish_date`, `category`, `description`, `stock`, `rating`)
VALUES
('Java核心技术卷I', 'Cay S. Horstmann', '978-7-111-52193-0', '机械工业出版社', '2016-09-01', '技术', 'Java技术经典参考书', 5, 4.5),
('深入理解计算机系统', 'Randal E. Bryant', '978-7-115-52193-1', '人民邮电出版社', '2015-11-01', '技术', '系统级编程经典', 3, 4.8),
('活着', '余华', '978-7-5322-5000-5', '上海文艺出版社', '2008-05-01', '文学', '人生哲理小说', 10, 4.9),
('人类简史', 'Yuval Noah Harari', '978-7-5322-9567-9', '中信出版社', '2014-11-01', '历史', '从动物到上帝', 8, 4.7);
