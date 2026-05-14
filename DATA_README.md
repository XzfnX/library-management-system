# 图书管理系统

## 数据说明

### 模拟数据量
- 图书：50本
- 学生：15人（不含管理员）
- 借阅记录：80条

### 为什么数据量较小？
为了避免localStorage占用过大空间，确保项目可以正常上传到GitHub并部署，我们限制了初始数据量。

### 如何重置数据？
如果你想重新生成模拟数据，可以在浏览器控制台中执行：

```javascript
// 清除所有本地数据
localStorage.clear();

// 然后刷新页面即可重新初始化
location.reload();
```

或者在应用中找到"重置数据"按钮（如果有）。

### 如何增加更多数据？
可以在 `src/data/dataInitializer.ts` 文件中修改数据生成数量：
```typescript
const booksData = generateBooks(100); // 改成你需要的数量
const studentsData = generateStudents(30);
const borrowRecordsData = generateBorrowRecords(books, allStudents, 200);
```

### localStorage 大小限制
- 大多数浏览器限制 localStorage 为 5-10MB
- 建议保持数据量在合理范围内
- 如果数据量过大，会导致存储失败

## 登录账号

### 管理员账号
- **账号**: admin
- **密码**: admin123

### 学生账号
- **学号**: 2024001
- **姓名**: 张三

其他学生账号信息可在学生管理页面查看。
