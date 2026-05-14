package com.library.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import com.library.entity.*;
import com.library.mapper.*;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class MybatisPlusConfig implements MetaObjectHandler {

    @Autowired
    @Lazy
    private UserMapper userMapper;
    
    @Autowired
    @Lazy
    private BookMapper bookMapper;
    
    @Autowired
    @Lazy
    private CategoryMapper categoryMapper;
    
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.H2));
        return interceptor;
    }

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }
    
    @Bean
    public DataInitializer dataInitializer() {
        return new DataInitializer(userMapper, bookMapper, categoryMapper, passwordEncoder);
    }
    
    public static class DataInitializer {
        private final UserMapper userMapper;
        private final BookMapper bookMapper;
        private final CategoryMapper categoryMapper;
        private final PasswordEncoder passwordEncoder;
        
        public DataInitializer(UserMapper userMapper, BookMapper bookMapper, 
                              CategoryMapper categoryMapper, PasswordEncoder passwordEncoder) {
            this.userMapper = userMapper;
            this.bookMapper = bookMapper;
            this.categoryMapper = categoryMapper;
            this.passwordEncoder = passwordEncoder;
            initDefaultData();
        }

    private void initDefaultData() {
        // 初始化系统分类
        if (categoryMapper.selectCount(null) == 0) {
            Category tech = new Category();
            tech.setName("技术");
            tech.setDescription("技术类书籍");
            tech.setIcon("code");
            tech.setSortOrder(1);
            tech.setIsSystem(1);
            categoryMapper.insert(tech);

            Category literature = new Category();
            literature.setName("文学");
            literature.setDescription("文学类书籍");
            literature.setIcon("book-open");
            literature.setSortOrder(2);
            literature.setIsSystem(1);
            categoryMapper.insert(literature);

            Category history = new Category();
            history.setName("历史");
            history.setDescription("历史类书籍");
            history.setIcon("landmark");
            history.setSortOrder(3);
            history.setIsSystem(1);
            categoryMapper.insert(history);

            Category economy = new Category();
            economy.setName("经济");
            economy.setDescription("经济管理类书籍");
            economy.setIcon("trending-up");
            economy.setSortOrder(4);
            economy.setIsSystem(1);
            categoryMapper.insert(economy);

            Category design = new Category();
            design.setName("设计");
            design.setDescription("设计类书籍");
            design.setIcon("palette");
            design.setSortOrder(5);
            design.setIsSystem(1);
            categoryMapper.insert(design);

            Category philosophy = new Category();
            philosophy.setName("哲学");
            philosophy.setDescription("哲学类书籍");
            philosophy.setIcon("lightbulb");
            philosophy.setSortOrder(6);
            philosophy.setIsSystem(1);
            categoryMapper.insert(philosophy);

            Category science = new Category();
            science.setName("科学");
            science.setDescription("科学类书籍");
            science.setIcon("flask");
            science.setSortOrder(7);
            science.setIsSystem(1);
            categoryMapper.insert(science);

            Category other = new Category();
            other.setName("其他");
            other.setDescription("其他类书籍");
            other.setIcon("folder");
            other.setSortOrder(8);
            other.setIsSystem(1);
            categoryMapper.insert(other);
        }

        // 初始化管理员和测试用户
        if (userMapper.selectCount(null) == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@library.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAvatar(null);
            admin.setRole(2);
            admin.setStatus(1);
            userMapper.insert(admin);

            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setEmail("test@library.com");
            testUser.setPassword(passwordEncoder.encode("admin123"));
            testUser.setAvatar(null);
            testUser.setRole(1);
            testUser.setStatus(1);
            userMapper.insert(testUser);
        }

        // 初始化测试图书
        if (bookMapper.selectCount(null) == 0) {
            Book book1 = new Book();
            book1.setTitle("Java核心技术卷I");
            book1.setAuthor("Cay S. Horstmann");
            book1.setIsbn("978-7-111-52193-0");
            book1.setPublisher("机械工业出版社");
            book1.setPublishDate(LocalDate.of(2016, 9, 1));
            book1.setCategory("技术");
            book1.setDescription("Java技术经典参考书");
            book1.setCoverUrl("https://placehold.co/400x600/1e40af/ffffff?text=Java核心技术");
            book1.setStock(5);
            book1.setRating(new BigDecimal("4.5"));
            book1.setRatingCount(10);
            book1.setUserId(1L);
            book1.setIsPublic(1);
            bookMapper.insert(book1);

            Book book2 = new Book();
            book2.setTitle("深入理解计算机系统");
            book2.setAuthor("Randal E. Bryant");
            book2.setIsbn("978-7-115-52193-1");
            book2.setPublisher("人民邮电出版社");
            book2.setPublishDate(LocalDate.of(2015, 11, 1));
            book2.setCategory("技术");
            book2.setDescription("系统级编程经典");
            book2.setCoverUrl("https://placehold.co/400x600/1e40af/ffffff?text=深入理解计算机系统");
            book2.setStock(3);
            book2.setRating(new BigDecimal("4.8"));
            book2.setRatingCount(8);
            book2.setUserId(1L);
            book2.setIsPublic(1);
            bookMapper.insert(book2);

            Book book3 = new Book();
            book3.setTitle("活着");
            book3.setAuthor("余华");
            book3.setIsbn("978-7-5322-5000-5");
            book3.setPublisher("上海文艺出版社");
            book3.setPublishDate(LocalDate.of(2008, 5, 1));
            book3.setCategory("文学");
            book3.setDescription("人生哲理小说");
            book3.setCoverUrl("https://placehold.co/400x600/f97316/ffffff?text=活着");
            book3.setStock(10);
            book3.setRating(new BigDecimal("4.9"));
            book3.setRatingCount(15);
            book3.setUserId(1L);
            book3.setIsPublic(1);
            bookMapper.insert(book3);

            Book book4 = new Book();
            book4.setTitle("人类简史");
            book4.setAuthor("Yuval Noah Harari");
            book4.setIsbn("978-7-5322-9567-9");
            book4.setPublisher("中信出版社");
            book4.setPublishDate(LocalDate.of(2014, 11, 1));
            book4.setCategory("历史");
            book4.setDescription("从动物到上帝");
            book4.setCoverUrl("https://placehold.co/400x600/22c55e/ffffff?text=人类简史");
            book4.setStock(8);
            book4.setRating(new BigDecimal("4.7"));
            book4.setRatingCount(12);
            book4.setUserId(1L);
            book4.setIsPublic(1);
            bookMapper.insert(book4);
        }
    }
}
}
