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
('testuser', 'test@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1),
('zhangsan', 'zhangsan@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1),
('lisi', 'lisi@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1),
('wangwu', 'wangwu@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1),
('zhaoliu', 'zhaoliu@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1),
('sunqi', 'sunqi@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1),
('zhouba', 'zhouba@library.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6zXyG', 1, 1);

-- =============================================
-- 初始化测试图书数据
-- =============================================
INSERT INTO `book` (`title`, `author`, `isbn`, `publisher`, `publish_date`, `category`, `description`, `stock`, `rating`)
VALUES
('Java核心技术卷I', 'Cay S. Horstmann', '978-7-111-52193-0', '机械工业出版社', '2016-09-01', '技术', 'Java技术经典参考书', 5, 4.5),
('深入理解计算机系统', 'Randal E. Bryant', '978-7-115-52193-1', '人民邮电出版社', '2015-11-01', '技术', '系统级编程经典', 3, 4.8),
('活着', '余华', '978-7-5322-5000-5', '上海文艺出版社', '2008-05-01', '文学', '人生哲理小说', 10, 4.9),
('人类简史', 'Yuval Noah Harari', '978-7-5322-9567-9', '中信出版社', '2014-11-01', '历史', '从动物到上帝', 8, 4.7),
('Python编程：从入门到实践', 'Eric Matthes', '978-7-115-42803-6', '人民邮电出版社', '2016-07-01', '技术', 'Python入门经典', 6, 4.6),
('算法导论', 'Thomas H. Cormen', '978-7-115-42801-2', '机械工业出版社', '2012-12-01', '技术', '算法领域经典教材', 4, 4.9),
('红楼梦', '曹雪芹', '978-7-5322-5001-2', '人民文学出版社', '2008-07-01', '文学', '中国古典四大名著之一', 12, 4.8),
('三体', '刘慈欣', '978-7-5322-9568-6', '重庆出版社', '2008-01-01', '科学', '科幻小说里程碑', 8, 4.7),
('明朝那些事儿', '当年明月', '978-7-80228-001-9', '中国友谊出版公司', '2006-11-01', '历史', '通俗历史读物', 7, 4.5),
('数据结构与算法 JavaScript描述', 'Michael McMillan', '978-7-115-42802-9', '人民邮电出版社', '2014-03-01', '技术', '前端工程师必读', 5, 4.4),
('Effective Java', 'Joshua Bloch', '978-7-115-42804-3', '电子工业出版社', '2018-01-01', '技术', 'Java最佳实践', 4, 4.8),
('设计模式', 'Erich Gamma', '978-7-115-42805-0', '机械工业出版社', '2015-09-01', '技术', '面向对象设计经典', 3, 4.7),
('重构改善既有代码设计', 'Martin Fowler', '978-7-115-42806-7', '人民邮电出版社', '2019-08-01', '技术', '代码重构指南', 5, 4.6),
('代码整洁之道', 'Robert C. Martin', '978-7-115-42807-4', '人民邮电出版社', '2017-01-01', '技术', '编写整洁代码', 6, 4.5),
('Spring实战', 'Craig Walls', '978-7-115-42808-1', '人民邮电出版社', '2018-09-01', '技术', 'Spring框架入门', 4, 4.4),
('Redis设计与实现', '黄健宏', '978-7-115-42809-8', '人民邮电出版社', '2014-06-01', '技术', 'Redis内部设计', 5, 4.7),
('MySQL必知必会', 'Ben Forta', '978-7-115-42810-4', '人民邮电出版社', '2019-01-01', '技术', 'MySQL入门经典', 8, 4.3),
('鸟哥的Linux私房菜', '鸟哥', '978-7-115-42811-1', '人民邮电出版社', '2017-08-01', '技术', 'Linux入门经典', 6, 4.5),
('Docker容器与容器云', '陈显华', '978-7-115-42812-8', '人民邮电出版社', '2018-05-01', '技术', 'Docker实践指南', 4, 4.4),
('Kubernetes权威指南', '龚正', '978-7-115-42813-5', '电子工业出版社', '2019-02-01', '技术', 'K8s入门到精通', 3, 4.6),
('百年孤独', '加西亚·马尔克斯', '978-7-5322-5002-9', '南海出版公司', '2011-06-01', '文学', '魔幻现实主义经典', 6, 4.8),
('追风筝的人', '卡勒德·胡赛尼', '978-7-5322-5003-6', '上海人民出版社', '2006-05-01', '文学', '感人至深的小说', 9, 4.6),
('解忧杂货店', '东野圭吾', '978-7-5322-5004-3', '南海出版公司', '2014-05-01', '文学', '温情悬疑小说', 10, 4.5),
('围城', '钱钟书', '978-7-5322-5005-0', '人民文学出版社', '2002-01-01', '文学', '中国现代文学经典', 7, 4.4),
('平凡的世界', '路遥', '978-7-5322-5006-7', '人民文学出版社', '2005-01-01', '文学', '茅盾文学奖作品', 8, 4.7),
('万历十五年', '黄仁宇', '978-7-5322-5007-4', '中华书局', '2006-01-01', '历史', '历史研究经典', 5, 4.6),
('全球通史', 'L.S.斯塔夫里阿诺斯', '978-7-5322-5008-1', '北京大学出版社', '2010-01-01', '历史', '世界历史概览', 4, 4.5),
('中国哲学简史', '冯友兰', '978-7-5322-5009-8', '北京大学出版社', '2010-09-01', '哲学', '中国哲学入门', 6, 4.4),
('苏菲的世界', '乔斯坦·贾德', '978-7-5322-5010-4', '作家出版社', '2007-10-01', '哲学', '哲学入门经典', 7, 4.5),
('资本论', '卡尔·马克思', '978-7-5322-5011-1', '上海三联书店', '2009-01-01', '经济', '政治经济学经典', 3, 4.2),
('国富论', '亚当·斯密', '978-7-5322-5012-8', '商务印书馆', '2011-01-01', '经济', '经济学开山之作', 4, 4.3),
('小狗钱钱', '博多·舍费尔', '978-7-5322-5013-5', '南海出版公司', '2009-01-01', '经济', '理财入门读物', 8, 4.4),
('富爸爸穷爸爸', '罗伯特·清崎', '978-7-5322-5014-2', '电子工业出版社', '2014-01-01', '经济', '财商教育经典', 7, 4.3),
('思考，快与慢', '丹尼尔·卡尼曼', '978-7-5322-5015-9', '中信出版社', '2012-07-01', '科学', '行为经济学经典', 5, 4.6),
('时间简史', '史蒂芬·霍金', '978-7-5322-5016-6', '湖南科学技术出版社', '2010-01-01', '科学', '宇宙学科普经典', 6, 4.5),
('自私的基因', '理查德·道金斯', '978-7-5322-5017-3', '中信出版社', '2012-09-01', '科学', '进化论科普', 4, 4.4),
('浪潮之巅', '吴军', '978-7-115-42814-2', '人民邮电出版社', '2016-05-01', '技术', '科技公司兴衰史', 5, 4.7),
('数学之美', '吴军', '978-7-115-42815-9', '人民邮电出版社', '2014-11-01', '技术', '自然语言处理', 4, 4.6),
('格局的胜利', '吴军', '978-7-115-42816-6', '人民邮电出版社', '2019-03-01', '经济', '格局决定命运', 6, 4.3),
('失控', '凯文·凯利', '978-7-115-42817-3', '电子工业出版社', '2016-01-01', '技术', '科技发展趋势', 3, 4.5),
('黑客与画家', 'Paul Graham', '978-7-115-42818-0', '人民邮电出版社', '2011-04-01', '技术', '硅谷创业之父', 5, 4.6),
('金字塔原理', '芭芭拉·明托', '978-7-115-42819-7', '民主与建设出版社', '2018-01-01', '经济', '思考表达逻辑', 7, 4.4),
('从零到一', '彼得·蒂尔', '978-7-115-42820-3', '中信出版社', '2015-01-01', '经济', '创业思维', 5, 4.5),
('影响力', '罗伯特·西奥迪尼', '978-7-115-42821-0', '万卷出版公司', '2016-05-01', '经济', '说服心理学', 8, 4.6),
('心理学与生活', '理查德·格里格', '978-7-115-42822-7', '人民邮电出版社', '2014-01-01', '科学', '心理学入门', 6, 4.5),
('社会心理学', '戴维·迈尔斯', '978-7-115-42823-4', '人民邮电出版社', '2015-01-01', '科学', '社会心理学经典', 4, 4.7),
('认知心理学', 'Robert L. Solso', '978-7-115-42824-1', '上海人民出版社', '2013-01-01', '科学', '认知科学入门', 5, 4.4),
('改变心理学的40项研究', 'Roger R. Hock', '978-7-115-42825-8', '中国轻工业出版社', '2010-01-01', '科学', '心理学研究经典', 6, 4.6),
('设计中的设计', '原研哉', '978-7-5322-5018-0', '山东人民出版社', '2006-03-01', '设计', '设计理念阐述', 4, 4.5);
