# 🚀 快速构建APK指南

## 方法一：一键构建脚本（推荐）

### macOS/Linux:
```bash
./build.sh
```

### Windows:
```bash
build.bat
```

脚本会自动完成：
1. ✅ 安装所有依赖
2. ✅ 清理构建缓存
3. ✅ 生成Debug APK
4. ✅ 复制APK到根目录

最终生成：`智能记账.apk`

---

## 方法二：手动构建

### 步骤1: 安装依赖
```bash
npm install
```

### 步骤2: 清理缓存
```bash
cd android
./gradlew clean
cd ..
```

### 步骤3: 构建APK

**Debug版本（推荐用于测试）:**
```bash
cd android
./gradlew assembleDebug
```

**Release版本（需要签名）:**
```bash
cd android
./gradlew assembleRelease
```

### 步骤4: 找到APK文件

APK生成位置：
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## 📱 安装APK到手机

### 方法1: 通过USB（需要adb）
```bash
# 连接手机并启用USB调试
adb install -r ./智能记账.apk
```

### 方法2: 直接传输
1. 将APK文件传输到手机（微信、QQ、数据线等）
2. 在手机上找到APK文件
3. 点击安装
4. 如提示"不允许安装未知应用"，需要在设置中允许

---

## ⚠️ 常见问题

### 1. gradlew: Permission denied
```bash
chmod +x android/gradlew
```

### 2. SDK not found
确保已安装Android Studio和Android SDK，并配置环境变量：
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk  # Windows
```

### 3. 构建失败
尝试清理缓存：
```bash
cd android
./gradlew clean
rm -rf .gradle
cd ..
rm -rf node_modules
npm install
```

### 4. Google ML Kit依赖下载慢
可以配置使用国内镜像，在 `android/build.gradle` 中添加阿里云镜像。

---

## 🎯 构建Release版本（用于发布）

Release版本需要签名密钥。如需生成Release APK：

1. 生成签名密钥：
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. 配置签名（在 `android/app/build.gradle` 中）

3. 构建：
```bash
cd android
./gradlew assembleRelease
```

---

## 📊 APK信息

- **应用名称**: 智能记账
- **包名**: com.billtrackerapp
- **版本**: 1.0.0
- **最低Android版本**: Android 7.0 (API 24)
- **目标Android版本**: Android 14 (API 34)

---

## ✨ 功能特性

✅ 账单记录和管理  
✅ 收支统计和可视化  
✅ Google ML Kit离线OCR识别  
✅ 智能分类  
✅ 本地数据存储  

---

**祝你构建成功！🎉**
