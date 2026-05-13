# 图书管理系统部署脚本

## 步骤 1: 创建 GitHub 仓库

1. 打开浏览器访问 https://github.com/new
2. 仓库名称填写: `library-management-system`
3. 选择 "Public"（公开仓库）
4. 不要勾选 "Add a README file"
5. 点击 "Create repository"

## 步骤 2: 复制仓库地址

创建成功后，页面会显示仓库地址，格式类似：
`https://github.com/你的用户名/library-management-system.git`

## 步骤 3: 添加远程仓库并推送

在终端中运行以下命令（将 `你的用户名` 替换为你的 GitHub 用户名）:

```bash
git remote add origin https://github.com/你的用户名/library-management-system.git
git branch -M main
git push -u origin main
```

## 步骤 4: 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings"（设置）
2. 左侧菜单找到 "Pages"
3. Source 部分选择 "Deploy from a branch"
4. Branch 选择 "gh-pages" 和 "/(root)"
5. 点击 "Save"

## 步骤 5: 创建 gh-pages 分支

```bash
npm run build
git checkout -b gh-pages
git merge main
git push origin gh-pages
```

## 步骤 6: 等待部署

部署可能需要 1-5 分钟，之后访问:
`https://你的用户名.github.io/library-management-system/`

---

## 快速命令汇总

```bash
# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/library-management-system.git

# 推送 main 分支
git branch -M main
git push -u origin main

# 构建并部署到 gh-pages
npm run build
git checkout -b gh-pages
git merge main
git push origin gh-pages
```

## 登录测试账号

- 管理员: admin / admin123
- 学生: student1 / 123456
