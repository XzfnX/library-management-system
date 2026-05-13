import { Book } from '../types/book';

const CATEGORIES = ['文学', '历史', '经济', '技术', '设计', '哲学', '科学', '教育', '艺术', '医学', '法律', '心理'];

const AUTHORS = [
  '鲁迅', '老舍', '巴金', '茅盾', '冰心', '钱钟书', '杨绛', '沈从文', '林语堂', '梁实秋',
  '司马迁', '曹雪芹', '施耐庵', '罗贯中', '吴承恩', '蒲松龄',
  '乔治·奥威尔', '海明威', '菲茨杰拉德', '马尔克斯', '卡尔维诺', '博尔赫斯',
  '曼昆', '萨缪尔森', '弗里德曼', '凯恩斯',
  '尤瓦尔·赫拉利', '贾雷德·戴蒙德', '理查德·道金斯', '史蒂芬·霍金',
  'James J. Gibson', 'Nicholas C. Zakas', 'Martin Fowler', 'Robert C. Martin',
  'Donald A. Norman', 'Steve Krug', 'Jesse James Garrett', 'Ethan Marcotte'
];

const PUBLISHERS = [
  '人民文学出版社', '作家出版社', '商务印书馆', '中华书局',
  '中信出版社', '机械工业出版社', '电子工业出版社', '清华大学出版社',
  '北京大学出版社', '浙江文艺出版社', '译林出版社', '上海译文出版社',
  '南海出版公司', '湖南科学技术出版社', '上海文艺出版社'
];

const BOOK_TITLES = [
  '红楼梦', '西游记', '三国演义', '水浒传', '活着', '围城', '平凡的世界', '百年孤独',
  '1984', '动物庄园', '飘', '傲慢与偏见', '呼啸山庄', '简爱', '基督山伯爵',
  '人类简史', '未来简史', '今日简史', '万历十五年', '明朝那些事儿', '全球通史',
  '中国哲学史大纲', '西方哲学史', '苏菲的世界', '理想国', '尼采自传',
  '经济学原理', '宏观经济学', '微观经济学', '国富论', '资本论', '就业、利息与货币通论',
  'JavaScript高级程序设计', '算法导论', '深入理解计算机系统', '设计模式', '代码大全',
  '人月神话', '架构整洁之道', '领域驱动设计', '重构', '编程珠玑',
  '时间简史', '自私的基因', '物种起源', '枪炮、病菌与钢铁', '宇宙',
  '从一到无穷大', '量子物理史话', '相对论', '上帝掷骰子吗',
  '设计心理学', '写给大家看的设计书', '设计中的设计', '点石成金', '情感化设计',
  '活着', '许三观卖血记', '兄弟', '在细雨中呼喊', '第七天',
  '蛙', '丰乳肥臀', '红高粱家族', '檀香刑', '透明的红萝卜',
  '白鹿原', '废都', '浮躁', '古船', '怀念狼',
  '黄金时代', '白银时代', '青铜时代', '黑铁时代', '我的精神家园',
  '沉默的大多数', '思维的乐趣', '我的灵魂我的书', '我是你爸爸', '老师好美'
];

const LOCATIONS = ['A区', 'B区', 'C区', 'D区', 'E区', 'F区', 'G区', 'H区'];

function generateISBN(index: number): string {
  const prefix = '978-7';
  const publisherCode = String(10000 + index).substring(1, 5);
  const bookCode = String(1000 + index).substring(1, 4);
  const checkDigit = index % 10;
  return `${prefix}-${publisherCode}-${bookCode}-${checkDigit}`;
}

function generateRandomDate(): string {
  const year = 2000 + Math.floor(Math.random() * 25);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBook(index: number): Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  const totalStock = Math.floor(Math.random() * 8) + 3;
  const stock = Math.floor(Math.random() * (totalStock + 1));
  const borrowCount = Math.floor(Math.random() * 100);
  
  return {
    title: BOOK_TITLES[index % BOOK_TITLES.length] + (index >= BOOK_TITLES.length ? ` (珍藏版${Math.floor(index / BOOK_TITLES.length) + 1})` : ''),
    author: randomChoice(AUTHORS),
    isbn: generateISBN(index),
    publisher: randomChoice(PUBLISHERS),
    publishDate: generateRandomDate(),
    category: randomChoice(CATEGORIES),
    description: `本书是${randomChoice(CATEGORIES)}类优秀读物，内容丰富，观点独到，适合广大读者阅读学习。`,
    stock: stock,
    totalStock: totalStock,
    borrowCount: borrowCount,
    status: stock > 0 ? 'available' : 'borrowed',
    location: `${randomChoice(LOCATIONS)}-${String(Math.floor(Math.random() * 50) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
    price: Math.floor(Math.random() * 150) + 20 + Math.random()
  };
}

export function generateBooks(count: number = 200): Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] {
  const books: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [];
  
  for (let i = 0; i < count; i++) {
    books.push(generateBook(i));
  }
  
  return books;
}

export const SAMPLE_BOOKS = generateBooks(200);
