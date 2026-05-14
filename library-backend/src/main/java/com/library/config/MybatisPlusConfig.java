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
    private BorrowRecordMapper borrowRecordMapper;
    
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
        return new DataInitializer(userMapper, bookMapper, categoryMapper, borrowRecordMapper, passwordEncoder);
    }
    
    public static class DataInitializer {
        private final UserMapper userMapper;
        private final BookMapper bookMapper;
        private final CategoryMapper categoryMapper;
        private final BorrowRecordMapper borrowRecordMapper;
        private final PasswordEncoder passwordEncoder;
        
        public DataInitializer(UserMapper userMapper, BookMapper bookMapper, 
                              CategoryMapper categoryMapper, BorrowRecordMapper borrowRecordMapper, 
                              PasswordEncoder passwordEncoder) {
            this.userMapper = userMapper;
            this.bookMapper = bookMapper;
            this.categoryMapper = categoryMapper;
            this.borrowRecordMapper = borrowRecordMapper;
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

            User zhangsan = new User();
            zhangsan.setUsername("zhangsan");
            zhangsan.setEmail("zhangsan@library.com");
            zhangsan.setPassword(passwordEncoder.encode("admin123"));
            zhangsan.setAvatar(null);
            zhangsan.setRole(1);
            zhangsan.setStatus(1);
            userMapper.insert(zhangsan);

            User lisi = new User();
            lisi.setUsername("lisi");
            lisi.setEmail("lisi@library.com");
            lisi.setPassword(passwordEncoder.encode("admin123"));
            lisi.setAvatar(null);
            lisi.setRole(1);
            lisi.setStatus(1);
            userMapper.insert(lisi);

            User wangwu = new User();
            wangwu.setUsername("wangwu");
            wangwu.setEmail("wangwu@library.com");
            wangwu.setPassword(passwordEncoder.encode("admin123"));
            wangwu.setAvatar(null);
            wangwu.setRole(1);
            wangwu.setStatus(1);
            userMapper.insert(wangwu);

            User zhaoliu = new User();
            zhaoliu.setUsername("zhaoliu");
            zhaoliu.setEmail("zhaoliu@library.com");
            zhaoliu.setPassword(passwordEncoder.encode("admin123"));
            zhaoliu.setAvatar(null);
            zhaoliu.setRole(1);
            zhaoliu.setStatus(1);
            userMapper.insert(zhaoliu);

            User sunqi = new User();
            sunqi.setUsername("sunqi");
            sunqi.setEmail("sunqi@library.com");
            sunqi.setPassword(passwordEncoder.encode("admin123"));
            sunqi.setAvatar(null);
            sunqi.setRole(1);
            sunqi.setStatus(1);
            userMapper.insert(sunqi);

            User zhouba = new User();
            zhouba.setUsername("zhouba");
            zhouba.setEmail("zhouba@library.com");
            zhouba.setPassword(passwordEncoder.encode("admin123"));
            zhouba.setAvatar(null);
            zhouba.setRole(1);
            zhouba.setStatus(1);
            userMapper.insert(zhouba);
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

            Book book5 = new Book();
            book5.setTitle("Python编程：从入门到实践");
            book5.setAuthor("Eric Matthes");
            book5.setIsbn("978-7-115-42803-6");
            book5.setPublisher("人民邮电出版社");
            book5.setPublishDate(LocalDate.of(2016, 7, 1));
            book5.setCategory("技术");
            book5.setDescription("Python入门经典");
            book5.setCoverUrl("https://placehold.co/400x600/3776ab/ffffff?text=Python编程");
            book5.setStock(6);
            book5.setRating(new BigDecimal("4.6"));
            book5.setRatingCount(18);
            book5.setUserId(1L);
            book5.setIsPublic(1);
            bookMapper.insert(book5);

            Book book6 = new Book();
            book6.setTitle("算法导论");
            book6.setAuthor("Thomas H. Cormen");
            book6.setIsbn("978-7-115-42801-2");
            book6.setPublisher("机械工业出版社");
            book6.setPublishDate(LocalDate.of(2012, 12, 1));
            book6.setCategory("技术");
            book6.setDescription("算法领域经典教材");
            book6.setCoverUrl("https://placehold.co/400x600/000000/ffffff?text=算法导论");
            book6.setStock(4);
            book6.setRating(new BigDecimal("4.9"));
            book6.setRatingCount(20);
            book6.setUserId(1L);
            book6.setIsPublic(1);
            bookMapper.insert(book6);

            Book book7 = new Book();
            book7.setTitle("红楼梦");
            book7.setAuthor("曹雪芹");
            book7.setIsbn("978-7-5322-5001-2");
            book7.setPublisher("人民文学出版社");
            book7.setPublishDate(LocalDate.of(2008, 7, 1));
            book7.setCategory("文学");
            book7.setDescription("中国古典四大名著之一");
            book7.setCoverUrl("https://placehold.co/400x600/bc1717/ffffff?text=红楼梦");
            book7.setStock(12);
            book7.setRating(new BigDecimal("4.8"));
            book7.setRatingCount(25);
            book7.setUserId(1L);
            book7.setIsPublic(1);
            bookMapper.insert(book7);

            Book book8 = new Book();
            book8.setTitle("三体");
            book8.setAuthor("刘慈欣");
            book8.setIsbn("978-7-5322-9568-6");
            book8.setPublisher("重庆出版社");
            book8.setPublishDate(LocalDate.of(2008, 1, 1));
            book8.setCategory("科学");
            book8.setDescription("科幻小说里程碑");
            book8.setCoverUrl("https://placehold.co/400x600/1e40af/ffffff?text=三体");
            book8.setStock(8);
            book8.setRating(new BigDecimal("4.7"));
            book8.setRatingCount(30);
            book8.setUserId(1L);
            book8.setIsPublic(1);
            bookMapper.insert(book8);

            Book book9 = new Book();
            book9.setTitle("明朝那些事儿");
            book9.setAuthor("当年明月");
            book9.setIsbn("978-7-80228-001-9");
            book9.setPublisher("中国友谊出版公司");
            book9.setPublishDate(LocalDate.of(2006, 11, 1));
            book9.setCategory("历史");
            book9.setDescription("通俗历史读物");
            book9.setCoverUrl("https://placehold.co/400x600/854d0e/ffffff?text=明朝那些事儿");
            book9.setStock(7);
            book9.setRating(new BigDecimal("4.5"));
            book9.setRatingCount(15);
            book9.setUserId(1L);
            book9.setIsPublic(1);
            bookMapper.insert(book9);

            Book book10 = new Book();
            book10.setTitle("数据结构与算法JavaScript描述");
            book10.setAuthor("Michael McMillan");
            book10.setIsbn("978-7-115-42802-9");
            book10.setPublisher("人民邮电出版社");
            book10.setPublishDate(LocalDate.of(2014, 3, 1));
            book10.setCategory("技术");
            book10.setDescription("前端工程师必读");
            book10.setCoverUrl("https://placehold.co/400x600/f7df1e/000000?text=数据结构与算法");
            book10.setStock(5);
            book10.setRating(new BigDecimal("4.4"));
            book10.setRatingCount(12);
            book10.setUserId(1L);
            book10.setIsPublic(1);
            bookMapper.insert(book10);

            Book book11 = new Book();
            book11.setTitle("Effective Java");
            book11.setAuthor("Joshua Bloch");
            book11.setIsbn("978-7-115-42804-3");
            book11.setPublisher("电子工业出版社");
            book11.setPublishDate(LocalDate.of(2018, 1, 1));
            book11.setCategory("技术");
            book11.setDescription("Java最佳实践");
            book11.setCoverUrl("https://placehold.co/400x600/ed8936/ffffff?text=Effective+Java");
            book11.setStock(4);
            book11.setRating(new BigDecimal("4.8"));
            book11.setRatingCount(16);
            book11.setUserId(1L);
            book11.setIsPublic(1);
            bookMapper.insert(book11);

            Book book12 = new Book();
            book12.setTitle("设计模式");
            book12.setAuthor("Erich Gamma");
            book12.setIsbn("978-7-115-42805-0");
            book12.setPublisher("机械工业出版社");
            book12.setPublishDate(LocalDate.of(2015, 9, 1));
            book12.setCategory("技术");
            book12.setDescription("面向对象设计经典");
            book12.setCoverUrl("https://placehold.co/400x600/8b5cf6/ffffff?text=设计模式");
            book12.setStock(3);
            book12.setRating(new BigDecimal("4.7"));
            book12.setRatingCount(14);
            book12.setUserId(1L);
            book12.setIsPublic(1);
            bookMapper.insert(book12);

            Book book13 = new Book();
            book13.setTitle("重构改善既有代码设计");
            book13.setAuthor("Martin Fowler");
            book13.setIsbn("978-7-115-42806-7");
            book13.setPublisher("人民邮电出版社");
            book13.setPublishDate(LocalDate.of(2019, 8, 1));
            book13.setCategory("技术");
            book13.setDescription("代码重构指南");
            book13.setCoverUrl("https://placehold.co/400x600/ec4899/ffffff?text=重构");
            book13.setStock(5);
            book13.setRating(new BigDecimal("4.6"));
            book13.setRatingCount(10);
            book13.setUserId(1L);
            book13.setIsPublic(1);
            bookMapper.insert(book13);

            Book book14 = new Book();
            book14.setTitle("代码整洁之道");
            book14.setAuthor("Robert C. Martin");
            book14.setIsbn("978-7-115-42807-4");
            book14.setPublisher("人民邮电出版社");
            book14.setPublishDate(LocalDate.of(2017, 1, 1));
            book14.setCategory("技术");
            book14.setDescription("编写整洁代码");
            book14.setCoverUrl("https://placehold.co/400x600/06b6d4/ffffff?text=代码整洁之道");
            book14.setStock(6);
            book14.setRating(new BigDecimal("4.5"));
            book14.setRatingCount(12);
            book14.setUserId(1L);
            book14.setIsPublic(1);
            bookMapper.insert(book14);

            Book book15 = new Book();
            book15.setTitle("Spring实战");
            book15.setAuthor("Craig Walls");
            book15.setIsbn("978-7-115-42808-1");
            book15.setPublisher("人民邮电出版社");
            book15.setPublishDate(LocalDate.of(2018, 9, 1));
            book15.setCategory("技术");
            book15.setDescription("Spring框架入门");
            book15.setCoverUrl("https://placehold.co/400x600/6db33f/ffffff?text=Spring实战");
            book15.setStock(4);
            book15.setRating(new BigDecimal("4.4"));
            book15.setRatingCount(9);
            book15.setUserId(1L);
            book15.setIsPublic(1);
            bookMapper.insert(book15);

            Book book16 = new Book();
            book16.setTitle("Redis设计与实现");
            book16.setAuthor("黄健宏");
            book16.setIsbn("978-7-115-42809-8");
            book16.setPublisher("人民邮电出版社");
            book16.setPublishDate(LocalDate.of(2014, 6, 1));
            book16.setCategory("技术");
            book16.setDescription("Redis内部设计");
            book16.setCoverUrl("https://placehold.co/400x600/dc382d/ffffff?text=Redis设计与实现");
            book16.setStock(5);
            book16.setRating(new BigDecimal("4.7"));
            book16.setRatingCount(11);
            book16.setUserId(1L);
            book16.setIsPublic(1);
            bookMapper.insert(book16);

            Book book17 = new Book();
            book17.setTitle("MySQL必知必会");
            book17.setAuthor("Ben Forta");
            book17.setIsbn("978-7-115-42810-4");
            book17.setPublisher("人民邮电出版社");
            book17.setPublishDate(LocalDate.of(2019, 1, 1));
            book17.setCategory("技术");
            book17.setDescription("MySQL入门经典");
            book17.setCoverUrl("https://placehold.co/400x600/4479a1/ffffff?text=MySQL必知必会");
            book17.setStock(8);
            book17.setRating(new BigDecimal("4.3"));
            book17.setRatingCount(15);
            book17.setUserId(1L);
            book17.setIsPublic(1);
            bookMapper.insert(book17);

            Book book18 = new Book();
            book18.setTitle("鸟哥的Linux私房菜");
            book18.setAuthor("鸟哥");
            book18.setIsbn("978-7-115-42811-1");
            book18.setPublisher("人民邮电出版社");
            book18.setPublishDate(LocalDate.of(2017, 8, 1));
            book18.setCategory("技术");
            book18.setDescription("Linux入门经典");
            book18.setCoverUrl("https://placehold.co/400x600/fcc200/000000?text=Linux私房菜");
            book18.setStock(6);
            book18.setRating(new BigDecimal("4.5"));
            book18.setRatingCount(13);
            book18.setUserId(1L);
            book18.setIsPublic(1);
            bookMapper.insert(book18);

            Book book19 = new Book();
            book19.setTitle("Docker容器与容器云");
            book19.setAuthor("陈显华");
            book19.setIsbn("978-7-115-42812-8");
            book19.setPublisher("人民邮电出版社");
            book19.setPublishDate(LocalDate.of(2018, 5, 1));
            book19.setCategory("技术");
            book19.setDescription("Docker实践指南");
            book19.setCoverUrl("https://placehold.co/400x600/2496ed/ffffff?text=Docker");
            book19.setStock(4);
            book19.setRating(new BigDecimal("4.4"));
            book19.setRatingCount(8);
            book19.setUserId(1L);
            book19.setIsPublic(1);
            bookMapper.insert(book19);

            Book book20 = new Book();
            book20.setTitle("Kubernetes权威指南");
            book20.setAuthor("龚正");
            book20.setIsbn("978-7-115-42813-5");
            book20.setPublisher("电子工业出版社");
            book20.setPublishDate(LocalDate.of(2019, 2, 1));
            book20.setCategory("技术");
            book20.setDescription("K8s入门到精通");
            book20.setCoverUrl("https://placehold.co/400x600/326ce5/ffffff?text=Kubernetes");
            book20.setStock(3);
            book20.setRating(new BigDecimal("4.6"));
            book20.setRatingCount(7);
            book20.setUserId(1L);
            book20.setIsPublic(1);
            bookMapper.insert(book20);

            Book book21 = new Book();
            book21.setTitle("百年孤独");
            book21.setAuthor("加西亚·马尔克斯");
            book21.setIsbn("978-7-5322-5002-9");
            book21.setPublisher("南海出版公司");
            book21.setPublishDate(LocalDate.of(2011, 6, 1));
            book21.setCategory("文学");
            book21.setDescription("魔幻现实主义经典");
            book21.setCoverUrl("https://placehold.co/400x600/7c3aed/ffffff?text=百年孤独");
            book21.setStock(6);
            book21.setRating(new BigDecimal("4.8"));
            book21.setRatingCount(22);
            book21.setUserId(1L);
            book21.setIsPublic(1);
            bookMapper.insert(book21);

            Book book22 = new Book();
            book22.setTitle("追风筝的人");
            book22.setAuthor("卡勒德·胡赛尼");
            book22.setIsbn("978-7-5322-5003-6");
            book22.setPublisher("上海人民出版社");
            book22.setPublishDate(LocalDate.of(2006, 5, 1));
            book22.setCategory("文学");
            book22.setDescription("感人至深的小说");
            book22.setCoverUrl("https://placehold.co/400x600/ef4444/ffffff?text=追风筝的人");
            book22.setStock(9);
            book22.setRating(new BigDecimal("4.6"));
            book22.setRatingCount(19);
            book22.setUserId(1L);
            book22.setIsPublic(1);
            bookMapper.insert(book22);

            Book book23 = new Book();
            book23.setTitle("解忧杂货店");
            book23.setAuthor("东野圭吾");
            book23.setIsbn("978-7-5322-5004-3");
            book23.setPublisher("南海出版公司");
            book23.setPublishDate(LocalDate.of(2014, 5, 1));
            book23.setCategory("文学");
            book23.setDescription("温情悬疑小说");
            book23.setCoverUrl("https://placehold.co/400x600/f59e0b/ffffff?text=解忧杂货店");
            book23.setStock(10);
            book23.setRating(new BigDecimal("4.5"));
            book23.setRatingCount(24);
            book23.setUserId(1L);
            book23.setIsPublic(1);
            bookMapper.insert(book23);

            Book book24 = new Book();
            book24.setTitle("围城");
            book24.setAuthor("钱钟书");
            book24.setIsbn("978-7-5322-5005-0");
            book24.setPublisher("人民文学出版社");
            book24.setPublishDate(LocalDate.of(2002, 1, 1));
            book24.setCategory("文学");
            book24.setDescription("中国现代文学经典");
            book24.setCoverUrl("https://placehold.co/400x600/10b981/ffffff?text=围城");
            book24.setStock(7);
            book24.setRating(new BigDecimal("4.4"));
            book24.setRatingCount(16);
            book24.setUserId(1L);
            book24.setIsPublic(1);
            bookMapper.insert(book24);

            Book book25 = new Book();
            book25.setTitle("平凡的世界");
            book25.setAuthor("路遥");
            book25.setIsbn("978-7-5322-5006-7");
            book25.setPublisher("人民文学出版社");
            book25.setPublishDate(LocalDate.of(2005, 1, 1));
            book25.setCategory("文学");
            book25.setDescription("茅盾文学奖作品");
            book25.setCoverUrl("https://placehold.co/400x600/6366f1/ffffff?text=平凡的世界");
            book25.setStock(8);
            book25.setRating(new BigDecimal("4.7"));
            book25.setRatingCount(21);
            book25.setUserId(1L);
            book25.setIsPublic(1);
            bookMapper.insert(book25);

            Book book26 = new Book();
            book26.setTitle("万历十五年");
            book26.setAuthor("黄仁宇");
            book26.setIsbn("978-7-5322-5007-4");
            book26.setPublisher("中华书局");
            book26.setPublishDate(LocalDate.of(2006, 1, 1));
            book26.setCategory("历史");
            book26.setDescription("历史研究经典");
            book26.setCoverUrl("https://placehold.co/400x600/84cc16/ffffff?text=万历十五年");
            book26.setStock(5);
            book26.setRating(new BigDecimal("4.6"));
            book26.setRatingCount(14);
            book26.setUserId(1L);
            book26.setIsPublic(1);
            bookMapper.insert(book26);

            Book book27 = new Book();
            book27.setTitle("全球通史");
            book27.setAuthor("L.S.斯塔夫里阿诺斯");
            book27.setIsbn("978-7-5322-5008-1");
            book27.setPublisher("北京大学出版社");
            book27.setPublishDate(LocalDate.of(2010, 1, 1));
            book27.setCategory("历史");
            book27.setDescription("世界历史概览");
            book27.setCoverUrl("https://placehold.co/400x600/a855f7/ffffff?text=全球通史");
            book27.setStock(4);
            book27.setRating(new BigDecimal("4.5"));
            book27.setRatingCount(12);
            book27.setUserId(1L);
            book27.setIsPublic(1);
            bookMapper.insert(book27);

            Book book28 = new Book();
            book28.setTitle("中国哲学简史");
            book28.setAuthor("冯友兰");
            book28.setIsbn("978-7-5322-5009-8");
            book28.setPublisher("北京大学出版社");
            book28.setPublishDate(LocalDate.of(2010, 9, 1));
            book28.setCategory("哲学");
            book28.setDescription("中国哲学入门");
            book28.setCoverUrl("https://placehold.co/400x600/f97316/ffffff?text=中国哲学简史");
            book28.setStock(6);
            book28.setRating(new BigDecimal("4.4"));
            book28.setRatingCount(10);
            book28.setUserId(1L);
            book28.setIsPublic(1);
            bookMapper.insert(book28);

            Book book29 = new Book();
            book29.setTitle("苏菲的世界");
            book29.setAuthor("乔斯坦·贾德");
            book29.setIsbn("978-7-5322-5010-4");
            book29.setPublisher("作家出版社");
            book29.setPublishDate(LocalDate.of(2007, 10, 1));
            book29.setCategory("哲学");
            book29.setDescription("哲学入门经典");
            book29.setCoverUrl("https://placehold.co/400x600/06b6d4/ffffff?text=苏菲的世界");
            book29.setStock(7);
            book29.setRating(new BigDecimal("4.5"));
            book29.setRatingCount(13);
            book29.setUserId(1L);
            book29.setIsPublic(1);
            bookMapper.insert(book29);

            Book book30 = new Book();
            book30.setTitle("资本论");
            book30.setAuthor("卡尔·马克思");
            book30.setIsbn("978-7-5322-5011-1");
            book30.setPublisher("上海三联书店");
            book30.setPublishDate(LocalDate.of(2009, 1, 1));
            book30.setCategory("经济");
            book30.setDescription("政治经济学经典");
            book30.setCoverUrl("https://placehold.co/400x600/ef4444/ffffff?text=资本论");
            book30.setStock(3);
            book30.setRating(new BigDecimal("4.2"));
            book30.setRatingCount(8);
            book30.setUserId(1L);
            book30.setIsPublic(1);
            bookMapper.insert(book30);

            Book book31 = new Book();
            book31.setTitle("国富论");
            book31.setAuthor("亚当·斯密");
            book31.setIsbn("978-7-5322-5012-8");
            book31.setPublisher("商务印书馆");
            book31.setPublishDate(LocalDate.of(2011, 1, 1));
            book31.setCategory("经济");
            book31.setDescription("经济学开山之作");
            book31.setCoverUrl("https://placehold.co/400x600/1e40af/ffffff?text=国富论");
            book31.setStock(4);
            book31.setRating(new BigDecimal("4.3"));
            book31.setRatingCount(9);
            book31.setUserId(1L);
            book31.setIsPublic(1);
            bookMapper.insert(book31);

            Book book32 = new Book();
            book32.setTitle("小狗钱钱");
            book32.setAuthor("博多·舍费尔");
            book32.setIsbn("978-7-5322-5013-5");
            book32.setPublisher("南海出版公司");
            book32.setPublishDate(LocalDate.of(2009, 1, 1));
            book32.setCategory("经济");
            book32.setDescription("理财入门读物");
            book32.setCoverUrl("https://placehold.co/400x600/22c55e/ffffff?text=小狗钱钱");
            book32.setStock(8);
            book32.setRating(new BigDecimal("4.4"));
            book32.setRatingCount(16);
            book32.setUserId(1L);
            book32.setIsPublic(1);
            bookMapper.insert(book32);

            Book book33 = new Book();
            book33.setTitle("富爸爸穷爸爸");
            book33.setAuthor("罗伯特·清崎");
            book33.setIsbn("978-7-5322-5014-2");
            book33.setPublisher("电子工业出版社");
            book33.setPublishDate(LocalDate.of(2014, 1, 1));
            book33.setCategory("经济");
            book33.setDescription("财商教育经典");
            book33.setCoverUrl("https://placehold.co/400x600/f59e0b/ffffff?text=富爸爸穷爸爸");
            book33.setStock(7);
            book33.setRating(new BigDecimal("4.3"));
            book33.setRatingCount(14);
            book33.setUserId(1L);
            book33.setIsPublic(1);
            bookMapper.insert(book33);

            Book book34 = new Book();
            book34.setTitle("思考，快与慢");
            book34.setAuthor("丹尼尔·卡尼曼");
            book34.setIsbn("978-7-5322-5015-9");
            book34.setPublisher("中信出版社");
            book34.setPublishDate(LocalDate.of(2012, 7, 1));
            book34.setCategory("科学");
            book34.setDescription("行为经济学经典");
            book34.setCoverUrl("https://placehold.co/400x600/8b5cf6/ffffff?text=思考快与慢");
            book34.setStock(5);
            book34.setRating(new BigDecimal("4.6"));
            book34.setRatingCount(18);
            book34.setUserId(1L);
            book34.setIsPublic(1);
            bookMapper.insert(book34);

            Book book35 = new Book();
            book35.setTitle("时间简史");
            book35.setAuthor("史蒂芬·霍金");
            book35.setIsbn("978-7-5322-5016-6");
            book35.setPublisher("湖南科学技术出版社");
            book35.setPublishDate(LocalDate.of(2010, 1, 1));
            book35.setCategory("科学");
            book35.setDescription("宇宙学科普经典");
            book35.setCoverUrl("https://placehold.co/400x600/0ea5e9/ffffff?text=时间简史");
            book35.setStock(6);
            book35.setRating(new BigDecimal("4.5"));
            book35.setRatingCount(20);
            book35.setUserId(1L);
            book35.setIsPublic(1);
            bookMapper.insert(book35);

            Book book36 = new Book();
            book36.setTitle("自私的基因");
            book36.setAuthor("理查德·道金斯");
            book36.setIsbn("978-7-5322-5017-3");
            book36.setPublisher("中信出版社");
            book36.setPublishDate(LocalDate.of(2012, 9, 1));
            book36.setCategory("科学");
            book36.setDescription("进化论科普");
            book36.setCoverUrl("https://placehold.co/400x600/10b981/ffffff?text=自私的基因");
            book36.setStock(4);
            book36.setRating(new BigDecimal("4.4"));
            book36.setRatingCount(12);
            book36.setUserId(1L);
            book36.setIsPublic(1);
            bookMapper.insert(book36);

            Book book37 = new Book();
            book37.setTitle("浪潮之巅");
            book37.setAuthor("吴军");
            book37.setIsbn("978-7-115-42814-2");
            book37.setPublisher("人民邮电出版社");
            book37.setPublishDate(LocalDate.of(2016, 5, 1));
            book37.setCategory("技术");
            book37.setDescription("科技公司兴衰史");
            book37.setCoverUrl("https://placehold.co/400x600/f97316/ffffff?text=浪潮之巅");
            book37.setStock(5);
            book37.setRating(new BigDecimal("4.7"));
            book37.setRatingCount(15);
            book37.setUserId(1L);
            book37.setIsPublic(1);
            bookMapper.insert(book37);

            Book book38 = new Book();
            book38.setTitle("数学之美");
            book38.setAuthor("吴军");
            book38.setIsbn("978-7-115-42815-9");
            book38.setPublisher("人民邮电出版社");
            book38.setPublishDate(LocalDate.of(2014, 11, 1));
            book38.setCategory("技术");
            book38.setDescription("自然语言处理");
            book38.setCoverUrl("https://placehold.co/400x600/3b82f6/ffffff?text=数学之美");
            book38.setStock(4);
            book38.setRating(new BigDecimal("4.6"));
            book38.setRatingCount(13);
            book38.setUserId(1L);
            book38.setIsPublic(1);
            bookMapper.insert(book38);

            Book book39 = new Book();
            book39.setTitle("格局的胜利");
            book39.setAuthor("吴军");
            book39.setIsbn("978-7-115-42816-6");
            book39.setPublisher("人民邮电出版社");
            book39.setPublishDate(LocalDate.of(2019, 3, 1));
            book39.setCategory("经济");
            book39.setDescription("格局决定命运");
            book39.setCoverUrl("https://placehold.co/400x600/84cc16/ffffff?text=格局的胜利");
            book39.setStock(6);
            book39.setRating(new BigDecimal("4.3"));
            book39.setRatingCount(10);
            book39.setUserId(1L);
            book39.setIsPublic(1);
            bookMapper.insert(book39);

            Book book40 = new Book();
            book40.setTitle("失控");
            book40.setAuthor("凯文·凯利");
            book40.setIsbn("978-7-115-42817-3");
            book40.setPublisher("电子工业出版社");
            book40.setPublishDate(LocalDate.of(2016, 1, 1));
            book40.setCategory("技术");
            book40.setDescription("科技发展趋势");
            book40.setCoverUrl("https://placehold.co/400x600/6b7280/ffffff?text=失控");
            book40.setStock(3);
            book40.setRating(new BigDecimal("4.5"));
            book40.setRatingCount(11);
            book40.setUserId(1L);
            book40.setIsPublic(1);
            bookMapper.insert(book40);

            Book book41 = new Book();
            book41.setTitle("黑客与画家");
            book41.setAuthor("Paul Graham");
            book41.setIsbn("978-7-115-42818-0");
            book41.setPublisher("人民邮电出版社");
            book41.setPublishDate(LocalDate.of(2011, 4, 1));
            book41.setCategory("技术");
            book41.setDescription("硅谷创业之父");
            book41.setCoverUrl("https://placehold.co/400x600/10b981/ffffff?text=黑客与画家");
            book41.setStock(5);
            book41.setRating(new BigDecimal("4.6"));
            book41.setRatingCount(14);
            book41.setUserId(1L);
            book41.setIsPublic(1);
            bookMapper.insert(book41);

            Book book42 = new Book();
            book42.setTitle("金字塔原理");
            book42.setAuthor("芭芭拉·明托");
            book42.setIsbn("978-7-115-42819-7");
            book42.setPublisher("民主与建设出版社");
            book42.setPublishDate(LocalDate.of(2018, 1, 1));
            book42.setCategory("经济");
            book42.setDescription("思考表达逻辑");
            book42.setCoverUrl("https://placehold.co/400x600/ec4899/ffffff?text=金字塔原理");
            book42.setStock(7);
            book42.setRating(new BigDecimal("4.4"));
            book42.setRatingCount(16);
            book42.setUserId(1L);
            book42.setIsPublic(1);
            bookMapper.insert(book42);

            Book book43 = new Book();
            book43.setTitle("从零到一");
            book43.setAuthor("彼得·蒂尔");
            book43.setIsbn("978-7-115-42820-3");
            book43.setPublisher("中信出版社");
            book43.setPublishDate(LocalDate.of(2015, 1, 1));
            book43.setCategory("经济");
            book43.setDescription("创业思维");
            book43.setCoverUrl("https://placehold.co/400x600/f59e0b/ffffff?text=从零到一");
            book43.setStock(5);
            book43.setRating(new BigDecimal("4.5"));
            book43.setRatingCount(17);
            book43.setUserId(1L);
            book43.setIsPublic(1);
            bookMapper.insert(book43);

            Book book44 = new Book();
            book44.setTitle("影响力");
            book44.setAuthor("罗伯特·西奥迪尼");
            book44.setIsbn("978-7-115-42821-0");
            book44.setPublisher("万卷出版公司");
            book44.setPublishDate(LocalDate.of(2016, 5, 1));
            book44.setCategory("经济");
            book44.setDescription("说服心理学");
            book44.setCoverUrl("https://placehold.co/400x600/3b82f6/ffffff?text=影响力");
            book44.setStock(8);
            book44.setRating(new BigDecimal("4.6"));
            book44.setRatingCount(19);
            book44.setUserId(1L);
            book44.setIsPublic(1);
            bookMapper.insert(book44);

            Book book45 = new Book();
            book45.setTitle("心理学与生活");
            book45.setAuthor("理查德·格里格");
            book45.setIsbn("978-7-115-42822-7");
            book45.setPublisher("人民邮电出版社");
            book45.setPublishDate(LocalDate.of(2014, 1, 1));
            book45.setCategory("科学");
            book45.setDescription("心理学入门");
            book45.setCoverUrl("https://placehold.co/400x600/8b5cf6/ffffff?text=心理学与生活");
            book45.setStock(6);
            book45.setRating(new BigDecimal("4.5"));
            book45.setRatingCount(15);
            book45.setUserId(1L);
            book45.setIsPublic(1);
            bookMapper.insert(book45);

            Book book46 = new Book();
            book46.setTitle("社会心理学");
            book46.setAuthor("戴维·迈尔斯");
            book46.setIsbn("978-7-115-42823-4");
            book46.setPublisher("人民邮电出版社");
            book46.setPublishDate(LocalDate.of(2015, 1, 1));
            book46.setCategory("科学");
            book46.setDescription("社会心理学经典");
            book46.setCoverUrl("https://placehold.co/400x600/06b6d4/ffffff?text=社会心理学");
            book46.setStock(4);
            book46.setRating(new BigDecimal("4.7"));
            book46.setRatingCount(12);
            book46.setUserId(1L);
            book46.setIsPublic(1);
            bookMapper.insert(book46);

            Book book47 = new Book();
            book47.setTitle("认知心理学");
            book47.setAuthor("Robert L. Solso");
            book47.setIsbn("978-7-115-42824-1");
            book47.setPublisher("上海人民出版社");
            book47.setPublishDate(LocalDate.of(2013, 1, 1));
            book47.setCategory("科学");
            book47.setDescription("认知科学入门");
            book47.setCoverUrl("https://placehold.co/400x600/10b981/ffffff?text=认知心理学");
            book47.setStock(5);
            book47.setRating(new BigDecimal("4.4"));
            book47.setRatingCount(10);
            book47.setUserId(1L);
            book47.setIsPublic(1);
            bookMapper.insert(book47);

            Book book48 = new Book();
            book48.setTitle("改变心理学的40项研究");
            book48.setAuthor("Roger R. Hock");
            book48.setIsbn("978-7-115-42825-8");
            book48.setPublisher("中国轻工业出版社");
            book48.setPublishDate(LocalDate.of(2010, 1, 1));
            book48.setCategory("科学");
            book48.setDescription("心理学研究经典");
            book48.setCoverUrl("https://placehold.co/400x600/f97316/ffffff?text=心理学研究");
            book48.setStock(6);
            book48.setRating(new BigDecimal("4.6"));
            book48.setRatingCount(14);
            book48.setUserId(1L);
            book48.setIsPublic(1);
            bookMapper.insert(book48);

            Book book49 = new Book();
            book49.setTitle("设计中的设计");
            book49.setAuthor("原研哉");
            book49.setIsbn("978-7-5322-5018-0");
            book49.setPublisher("山东人民出版社");
            book49.setPublishDate(LocalDate.of(2006, 3, 1));
            book49.setCategory("设计");
            book49.setDescription("设计理念阐述");
            book49.setCoverUrl("https://placehold.co/400x600/6b7280/ffffff?text=设计中的设计");
            book49.setStock(4);
            book49.setRating(new BigDecimal("4.5"));
            book49.setRatingCount(13);
            book49.setUserId(1L);
            book49.setIsPublic(1);
            bookMapper.insert(book49);

            Book book50 = new Book();
            book50.setTitle("设计心理学");
            book50.setAuthor("唐纳德·诺曼");
            book50.setIsbn("978-7-115-42826-5");
            book50.setPublisher("中信出版社");
            book50.setPublishDate(LocalDate.of(2015, 10, 1));
            book50.setCategory("设计");
            book50.setDescription("设计心理学入门");
            book50.setCoverUrl("https://placehold.co/400x600/ec4899/ffffff?text=设计心理学");
            book50.setStock(5);
            book50.setRating(new BigDecimal("4.4"));
            book50.setRatingCount(11);
            book50.setUserId(1L);
            book50.setIsPublic(1);
            bookMapper.insert(book50);
        }

        // 初始化测试借阅记录
        initBorrowRecords();
    }

    private void initBorrowRecords() {
        if (borrowRecordMapper.selectCount(null) > 0) {
            return;
        }

        // 7个学生用户ID (2-8)
        Long[] studentIds = {2L, 3L, 4L, 5L, 6L, 7L, 8L};
        // 50本书的ID (1-50)
        Long[] bookIds = {1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L, 10L, 11L, 12L, 13L, 14L, 15L, 16L, 17L, 18L, 19L, 20L,
                         21L, 22L, 23L, 24L, 25L, 26L, 27L, 28L, 29L, 30L, 31L, 32L, 33L, 34L, 35L, 36L, 37L, 38L, 39L, 40L,
                         41L, 42L, 43L, 44L, 45L, 46L, 47L, 48L, 49L, 50L};

        java.util.Random random = new java.util.Random();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        // 创建40条随机借阅记录
        for (int i = 0; i < 40; i++) {
            BorrowRecord record = new BorrowRecord();
            record.setUserId(studentIds[random.nextInt(studentIds.length)]);
            record.setBookId(bookIds[random.nextInt(bookIds.length)]);
            
            // 随机借阅日期（过去60天内）
            int daysAgo = random.nextInt(60) + 1;
            record.setBorrowDate(now.minusDays(daysAgo));
            
            // 应还日期（借阅后30天）
            record.setDueDate(record.getBorrowDate().plusDays(30));
            
            // 随机状态：60%已归还，30%借阅中，10%逾期
            int statusRandom = random.nextInt(100);
            if (statusRandom < 60) {
                // 已归还
                record.setStatus("returned");
                // 归还日期在借阅日期和应还日期之间
                int borrowDays = random.nextInt(25) + 1;
                record.setReturnDate(record.getBorrowDate().plusDays(borrowDays));
                record.setRenewCount(random.nextInt(2));
            } else if (statusRandom < 90) {
                // 借阅中
                record.setStatus("borrowed");
                record.setRenewCount(random.nextInt(2));
            } else {
                // 逾期
                record.setStatus("overdue");
                record.setDueDate(now.minusDays(random.nextInt(15) + 1));
                record.setRenewCount(random.nextInt(2));
            }
            
            record.setCreatedAt(record.getBorrowDate());
            record.setUpdatedAt(now);
            record.setDeleted(0);
            
            borrowRecordMapper.insert(record);
        }
    }
}
}
