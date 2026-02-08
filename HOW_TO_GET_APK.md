# 🎯 如何获取APK文件

## ⚠️ 重要说明

**我无法直接提供APK下载**，因为：
1. APK需要在本地编译生成（需要Android构建环境）
2. 编译过程需要5-15分钟
3. 每个人的APK需要在自己的机器上构建

## 🚀 超简单：一行命令生成APK

打开终端，复制粘贴运行：

```bash
cd /Users/myc/CodeBuddy/20260209021715 && ./quick-build.sh
```

**就这么简单！** 脚本会自动完成所有工作，最后生成 `智能记账.apk`

---

## 📋 详细步骤

如果你是第一次构建React Native应用，请按以下步骤：

### 前置要求检查

```bash
# 检查Node.js (需要 18+)
node -v

# 检查JDK (需要 11+)
java -version

# 检查Android SDK
echo $ANDROID_HOME
```

如果有任何命令失败，请先安装对应工具。

### 开始构建

```bash
# 进入项目目录
cd /Users/myc/CodeBuddy/20260209021715

# 运行构建脚本
./quick-build.sh
```

### 构建时间

- 首次构建: 10-20分钟（需要下载依赖）
- 后续构建: 3-5分钟

---

## 📱 获取APK后的安装方式

APK生成位置：`/Users/myc/CodeBuddy/20260209021715/智能记账.apk`

### 方式1: 数据线传输（最快）
1. 用数据线连接手机和电脑
2. 将APK复制到手机存储
3. 在手机上找到APK点击安装

### 方式2: 微信/QQ发送
1. 在电脑微信/QQ上发送APK给手机
2. 手机端下载
3. 点击安装

### 方式3: 云盘分享
1. 上传APK到网盘（百度网盘、阿里云盘等）
2. 手机端下载
3. 安装

### 方式4: AirDrop（Mac用户）
1. 右键APK文件
2. 选择"隔空投送"
3. 发送到iPhone/iPad

---

## 🔧 环境配置（如果你还没装）

### 1. 安装Node.js
https://nodejs.org/ - 下载LTS版本

### 2. 安装Android Studio
https://developer.android.com/studio

安装后配置环境变量：
```bash
# macOS/Linux - 添加到 ~/.zshrc 或 ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows - 系统环境变量
ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk
```

### 3. 安装JDK 11+
```bash
# macOS (使用Homebrew)
brew install openjdk@11

# 或从Oracle官网下载
https://www.oracle.com/java/technologies/downloads/
```

---

## ❓ 常见问题

### Q: 我能直接下载现成的APK吗？
**A:** 不能，每个人需要在自己机器上构建。但构建很简单，只需运行一个脚本！

### Q: 构建失败怎么办？
**A:** 检查以下几点：
1. Node.js版本 >= 18
2. JDK版本 >= 11
3. 已安装Android Studio和SDK
4. 配置了ANDROID_HOME环境变量
5. 网络连接正常

### Q: 需要多少磁盘空间？
**A:** 
- Android SDK: ~5GB
- 项目依赖: ~500MB
- 生成的APK: ~30MB

### Q: 我不懂技术，能帮我构建吗？
**A:** 可以！只要你：
1. 安装了Node.js和Android Studio
2. 在终端运行 `./quick-build.sh`
3. 等待完成

脚本会自动完成所有技术细节！

---

## 💡 需要我帮你？

如果构建过程中遇到任何错误，请：
1. 复制完整的错误信息
2. 告诉我你的操作系统
3. 告诉我卡在哪一步

我会帮你解决！🚀

---

**开始构建吧！只需一行命令：`./quick-build.sh`**
