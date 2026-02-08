# GitHub Actions 云端构建指南

## 🚀 快速开始（5分钟获取APK）

### 第1步：初始化Git仓库

```bash
cd /Users/myc/CodeBuddy/20260209021715
git init
git add .
git commit -m "Initial commit: 记账APP with OCR"
```

### 第2步：创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名称：`BillTrackerApp`（或其他名字）
3. 选择 **Private**（私有仓库，代码不公开）
4. 点击"Create repository"

### 第3步：推送代码到GitHub

```bash
# 替换下面的 YOUR_USERNAME 为你的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/BillTrackerApp.git
git branch -M main
git push -u origin main
```

**提示**: 如果推送时要求输入密码，需要使用 Personal Access Token：
- 访问 https://github.com/settings/tokens
- 生成新token，勾选 `repo` 权限
- 使用token作为密码

### 第4步：等待构建完成

1. 推送成功后，访问你的GitHub仓库
2. 点击顶部的 **Actions** 标签
3. 看到 "Build Android APK" 工作流正在运行（约15分钟）
4. 构建成功后，有两种方式下载APK：

**方式A - 下载Artifacts**:
- 点击完成的构建任务
- 下拉到底部"Artifacts"区域
- 下载 `BillTrackerApp-release.zip`
- 解压获得 `app-release.apk`

**方式B - 从Releases下载**:
- 点击仓库右侧的 **Releases**
- 找到最新版本
- 直接下载 `app-release.apk`

---

## 📦 构建流程说明

GitHub Actions会自动执行以下步骤：

1. ✅ 在Ubuntu虚拟机上运行
2. ✅ 安装Node.js 18和Java 17
3. ✅ 安装项目依赖（npm包）
4. ✅ 配置Android SDK
5. ✅ 生成签名密钥（用于Release构建）
6. ✅ 编译APK文件
7. ✅ 上传APK到Artifacts和Releases

**整个过程完全自动化，无需任何本地Android环境！**

---

## 🔄 后续更新

每次修改代码后，只需：

```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Actions会自动重新构建新的APK。

---

## 🔧 高级配置

### 自定义签名密钥（可选）

如果你已有自己的keystore文件：

1. 将 `release.keystore` 转换为base64：
   ```bash
   base64 -i your-release.keystore -o keystore.txt
   ```

2. 在GitHub仓库设置中添加Secrets：
   - `KEYSTORE_FILE`: keystore.txt的内容
   - `KEYSTORE_PASSWORD`: keystore密码
   - `KEY_ALIAS`: 密钥别名
   - `KEY_PASSWORD`: 密钥密码

3. 修改 `.github/workflows/build-android.yml` 的keystore创建步骤

### 修改构建触发条件

工作流默认在以下情况触发：
- 推送到 `main` 或 `master` 分支
- 手动触发（Actions页面点击"Run workflow"）

可以在 `.github/workflows/build-android.yml` 中的 `on:` 部分修改。

---

## ❓ 常见问题

**Q: 构建失败怎么办？**
A: 在Actions页面点击失败的任务，查看详细日志。常见原因：
- 依赖安装失败：检查package.json
- Gradle构建错误：查看android/app/build.gradle配置

**Q: 构建需要多长时间？**
A: 首次构建约12-15分钟，后续构建因有缓存会更快（8-10分钟）。

**Q: 免费吗？**
A: GitHub Actions对公共仓库完全免费。私有仓库每月有2000分钟免费额度，足够使用。

**Q: APK能否在Google Play上发布？**
A: 可以！但需要：
1. 使用正式的签名密钥
2. 修改包名（避免冲突）
3. 遵守Google Play政策

---

## 📱 安装APK到手机

1. 将APK文件传输到Android手机
2. 打开"设置" > "安全" > 开启"未知来源"
3. 使用文件管理器打开APK安装
4. 首次启动会请求相机和存储权限（用于OCR扫描）

---

## 🎉 完成！

现在你拥有了一个全自动的Android构建流水线！

有任何问题欢迎查看GitHub Actions的构建日志。
