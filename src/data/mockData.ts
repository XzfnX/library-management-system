import { User } from '../types/user';
import { Book } from '../types/book';
import { BorrowRecord } from '../types/borrow';

export const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@library.com', phone: '', role: 'admin', status: 1, avatar: null },
  { id: 2, username: 'testuser', email: 'test@library.com', phone: '2024001', role: 'student', status: 1, avatar: null },
  { id: 3, username: 'zhangsan', email: 'zhangsan@library.com', phone: '2024002', role: 'student', status: 1, avatar: null },
  { id: 4, username: 'lisi', email: 'lisi@library.com', phone: '2024003', role: 'student', status: 1, avatar: null },
  { id: 5, username: 'wangwu', email: 'wangwu@library.com', phone: '2024004', role: 'student', status: 1, avatar: null },
  { id: 6, username: 'zhaoliu', email: 'zhaoliu@library.com', phone: '2024005', role: 'student', status: 1, avatar: null },
  { id: 7, username: 'sunqi', email: 'sunqi@library.com', phone: '2024006', role: 'student', status: 1, avatar: null },
  { id: 8, username: 'zhouba', email: 'zhouba@library.com', phone: '2024007', role: 'student', status: 1, avatar: null },
];

export const mockBooks: Book[] = [
  { id: 1, title: 'Java核心技术', author: 'Cay S. Horstmann', isbn: '9787111547427', publisher: '机械工业出版社', publishDate: '2019-01-01', category: '技术', description: 'Java编程经典教材', stock: 5, rating: 4.5, ratingCount: 128 },
  { id: 2, title: '算法导论', author: 'Thomas H. Cormen', isbn: '9787111407010', publisher: '机械工业出版社', publishDate: '2012-01-01', category: '技术', description: '算法领域的经典教材', stock: 3, rating: 4.8, ratingCount: 256 },
  { id: 3, title: 'Python编程：从入门到实践', author: 'Eric Matthes', isbn: '9787115428577', publisher: '人民邮电出版社', publishDate: '2016-07-01', category: '技术', description: 'Python入门经典', stock: 8, rating: 4.6, ratingCount: 312 },
  { id: 4, title: '设计模式：可复用面向对象软件的基础', author: 'Erich Gamma', isbn: '9787111075547', publisher: '机械工业出版社', publishDate: '2000-09-01', category: '技术', description: '设计模式经典著作', stock: 4, rating: 4.7, ratingCount: 189 },
  { id: 5, title: '活着', author: '余华', isbn: '9787506358164', publisher: '作家出版社', publishDate: '2012-08-01', category: '文学', description: '中国当代文学经典', stock: 10, rating: 4.9, ratingCount: 512 },
  { id: 6, title: '红楼梦', author: '曹雪芹', isbn: '9787020002200', publisher: '人民文学出版社', publishDate: '1982-03-01', category: '文学', description: '中国古典四大名著之一', stock: 6, rating: 4.9, ratingCount: 890 },
  { id: 7, title: '百年孤独', author: '加西亚·马尔克斯', isbn: '9787544244909', publisher: '南海出版公司', publishDate: '2011-06-01', category: '文学', description: '魔幻现实主义经典', stock: 5, rating: 4.8, ratingCount: 445 },
  { id: 8, title: '三体', author: '刘慈欣', isbn: '9787536692930', publisher: '重庆出版社', publishDate: '2008-01-01', category: '科幻', description: '中国科幻里程碑作品', stock: 12, rating: 4.9, ratingCount: 765 },
  { id: 9, title: '人类简史', author: '尤瓦尔·赫拉利', isbn: '9787508653883', publisher: '中信出版社', publishDate: '2017-02-01', category: '历史', description: '从认知革命到人工智能时代', stock: 7, rating: 4.7, ratingCount: 328 },
  { id: 10, title: '明朝那些事儿', author: '当年明月', isbn: '9787508617246', publisher: '浙江人民出版社', publishDate: '2006-09-01', category: '历史', description: '通俗历史读物经典', stock: 9, rating: 4.6, ratingCount: 623 },
  { id: 11, title: '万历十五年', author: '黄仁宇', isbn: '9787108009820', publisher: '生活·读书·新知三联书店', publishDate: '1997-05-01', category: '历史', description: '大历史观经典著作', stock: 4, rating: 4.5, ratingCount: 234 },
  { id: 12, title: '资本论', author: '卡尔·马克思', isbn: '9787010002258', publisher: '人民出版社', publishDate: '2004-01-01', category: '经济', description: '马克思主义政治经济学经典', stock: 3, rating: 4.3, ratingCount: 156 },
  { id: 13, title: '国富论', author: '亚当·斯密', isbn: '9787208052733', publisher: '上海人民出版社', publishDate: '2006-01-01', category: '经济', description: '经济学开山之作', stock: 5, rating: 4.4, ratingCount: 187 },
  { id: 14, title: '小狗钱钱', author: '博多·舍费尔', isbn: '9787530941288', publisher: '天津教育出版社', publishDate: '2009-01-01', category: '经济', description: '儿童财商教育启蒙', stock: 8, rating: 4.5, ratingCount: 267 },
  { id: 15, title: '时间简史', author: '史蒂芬·霍金', isbn: '9787535732309', publisher: '湖南科学技术出版社', publishDate: '2010-04-01', category: '科学', description: '科普读物经典', stock: 6, rating: 4.6, ratingCount: 345 },
  { id: 16, title: '思考，快与慢', author: '丹尼尔·卡尼曼', isbn: '9787508633558', publisher: '中信出版社', publishDate: '2012-07-01', category: '心理学', description: '诺贝尔经济学奖得主作品', stock: 5, rating: 4.5, ratingCount: 298 },
  { id: 17, title: '心理学与生活', author: '理查德·格里格', isbn: '9787115111302', publisher: '人民邮电出版社', publishDate: '2003-10-01', category: '心理学', description: '心理学入门经典', stock: 4, rating: 4.7, ratingCount: 178 },
  { id: 18, title: '中国哲学简史', author: '冯友兰', isbn: '9787108010200', publisher: '生活·读书·新知三联书店', publishDate: '2009-05-01', category: '哲学', description: '中国哲学入门读物', stock: 5, rating: 4.6, ratingCount: 223 },
  { id: 19, title: '苏菲的世界', author: '乔斯坦·贾德', isbn: '9787544238588', publisher: '南海出版公司', publishDate: '2007-06-01', category: '哲学', description: '哲学入门小说', stock: 7, rating: 4.5, ratingCount: 356 },
  { id: 20, title: '设计中的设计', author: '原研哉', isbn: '9787208058132', publisher: '山东人民出版社', publishDate: '2006-11-01', category: '设计', description: '日本设计大师作品', stock: 4, rating: 4.6, ratingCount: 145 },
  { id: 21, title: '设计心理学', author: '唐纳德·诺曼', isbn: '9787111176753', publisher: '机械工业出版社', publishDate: '2003-10-01', category: '设计', description: '设计心理学经典', stock: 3, rating: 4.4, ratingCount: 123 },
  { id: 22, title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', isbn: '9787115275790', publisher: '人民邮电出版社', publishDate: '2012-02-01', category: '技术', description: 'JavaScript权威指南', stock: 5, rating: 4.7, ratingCount: 234 },
  { id: 23, title: '深入理解计算机系统', author: 'Randal E. Bryant', isbn: '9787111544937', publisher: '机械工业出版社', publishDate: '2016-12-01', category: '技术', description: '计算机系统经典教材', stock: 4, rating: 4.8, ratingCount: 167 },
  { id: 24, title: '操作系统概念', author: 'Abraham Silberschatz', isbn: '9787111213830', publisher: '机械工业出版社', publishDate: '2012-06-01', category: '技术', description: '操作系统经典教材', stock: 3, rating: 4.6, ratingCount: 112 },
  { id: 25, title: '围城', author: '钱钟书', isbn: '9787020002217', publisher: '人民文学出版社', publishDate: '1980-10-01', category: '文学', description: '中国现代文学经典', stock: 6, rating: 4.7, ratingCount: 345 },
  { id: 26, title: '呐喊', author: '鲁迅', isbn: '9787020002224', publisher: '人民文学出版社', publishDate: '1979-03-01', category: '文学', description: '鲁迅短篇小说集', stock: 8, rating: 4.6, ratingCount: 456 },
  { id: 27, title: '边城', author: '沈从文', isbn: '9787020002231', publisher: '人民文学出版社', publishDate: '1981-01-01', category: '文学', description: '沈从文代表作', stock: 5, rating: 4.5, ratingCount: 234 },
  { id: 28, title: '骆驼祥子', author: '老舍', isbn: '9787020002248', publisher: '人民文学出版社', publishDate: '1978-05-01', category: '文学', description: '老舍经典小说', stock: 7, rating: 4.6, ratingCount: 289 },
  { id: 29, title: '三国演义', author: '罗贯中', isbn: '9787020002255', publisher: '人民文学出版社', publishDate: '1973-12-01', category: '文学', description: '中国古典四大名著', stock: 6, rating: 4.8, ratingCount: 567 },
  { id: 30, title: '水浒传', author: '施耐庵', isbn: '9787020002262', publisher: '人民文学出版社', publishDate: '1975-01-01', category: '文学', description: '中国古典四大名著', stock: 5, rating: 4.7, ratingCount: 432 },
];

export const mockBorrowRecords: BorrowRecord[] = [
  { id: 1, userId: 2, bookId: 1, borrowDate: '2026-05-01', dueDate: '2026-06-01', returnDate: null, status: 'borrowed', renewCount: 0 },
  { id: 2, userId: 2, bookId: 5, borrowDate: '2026-04-15', dueDate: '2026-05-15', returnDate: '2026-05-10', status: 'returned', renewCount: 0 },
  { id: 3, userId: 3, bookId: 2, borrowDate: '2026-05-05', dueDate: '2026-06-05', returnDate: null, status: 'borrowed', renewCount: 0 },
  { id: 4, userId: 3, bookId: 8, borrowDate: '2026-04-20', dueDate: '2026-05-20', returnDate: '2026-05-05', status: 'returned', renewCount: 1 },
  { id: 5, userId: 4, bookId: 3, borrowDate: '2026-05-08', dueDate: '2026-06-08', returnDate: null, status: 'borrowed', renewCount: 0 },
  { id: 6, userId: 5, bookId: 9, borrowDate: '2026-03-20', dueDate: '2026-04-20', returnDate: null, status: 'overdue', renewCount: 0 },
  { id: 7, userId: 6, bookId: 4, borrowDate: '2026-05-01', dueDate: '2026-06-01', returnDate: null, status: 'borrowed', renewCount: 0 },
  { id: 8, userId: 2, bookId: 10, borrowDate: '2026-04-10', dueDate: '2026-05-10', returnDate: '2026-05-08', status: 'returned', renewCount: 0 },
];

export const mockStatistics = {
  totalBooks: 30,
  totalUsers: 8,
  totalBorrows: 40,
  currentBorrows: 5,
  overdueBorrows: 2,
  totalComments: 156,
  averageRating: 4.5
};
