# 🚨 环境配置指南 - 必读

## 当前状态

经过检查，你的系统缺少构建Android APK的必要环境：

✅ **Node.js**: v24.12.0 - 已安装  
⚠️ **Java/JDK**: 未正确配置  
❌ **Android SDK**: 未安装  

## 🎯 解决方案（选择一种）

### 方案一：使用Android Studio（最简单，强烈推荐）⭐

Android Studio会自动安装所有需要的工具，包括JDK和Android SDK。

#### 步骤：

1. **下载Android Studio**
   - 访问：https://developer.android.com/studio
   - 下载Mac版本（约1GB）
   - 安装到应用程序文件夹

2. **首次启动配置**
   - 打开Android Studio
   - 按照向导安装Android SDK（会自动安装JDK）
   - 选择"Standard"安装类型
   - 等待下载完成（约5GB）

3. **配置环境变量**
   
   打开终端，运行：
   ```bash
   echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
   source ~/.zshrc
   ```

4. **验证安装**
   ```bash
   echo $ANDROID_HOME
   # 应该输出: /Users/你的用户名/Library/Android/sdk
   ```

5. **返回构建APK**
   ```bash
   cd /Users/myc/CodeBuddy/20260209021715
   ./quick-build.sh
   ```

---

### 方案二：仅安装命令行工具（适合有经验的开发者）

如果你不想安装完整的Android Studio：

#### 1. 安装Xcode Command Line Tools
```bash
xcode-select --install
```
等待安装完成（约500MB）

#### 2. 安装JDK
```bash
# 下载并安装 JDK 17
# 访问: https://www.oracle.com/java/technologies/downloads/#jdk17-mac
# 选择 macOS Installer (.dmg)
```

或者等Xcode安装完后：
```bash
brew install openjdk@17
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

#### 3. 下载Android Command Line Tools
```bash
cd ~
mkdir -p android-sdk/cmdline-tools
cd android-sdk/cmdline-tools

# 下载 Command Line Tools
# 访问: https://developer.android.com/studio#command-tools
# 下载 Mac 版本并解压到此目录
```

#### 4. 安装必要的Android组件
```bash
export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

#### 5. 配置环境变量
```bash
echo 'export ANDROID_HOME=$HOME/android-sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc
```

---

## 📱 安装完成后

环境配置好后，运行：

```bash
cd /Users/myc/CodeBuddy/20260209021715
./quick-build.sh
```

脚本会自动：
1. 安装npm依赖
2. 构建APK
3. 生成 `智能记账.apk`

---

## ⏱️ 时间估算

- **方案一（Android Studio）**：
  - 下载: 15-30分钟
  - 安装: 5-10分钟
  - 总计: 20-40分钟

- **方案二（命令行）**：
  - 安装: 10-20分钟
  - 配置: 5-10分钟
  - 总计: 15-30分钟

---

## ❓ 常见问题

### Q: 我应该选择哪个方案？
**A:** 如果你是第一次构建Android应用，选择**方案一（Android Studio）**。它更简单，不容易出错。

### Q: 我已经有Xcode了，还需要Android Studio吗？
**A:** Xcode是iOS开发工具，Android需要Android Studio或Android SDK。

### Q: 磁盘空间不够怎么办？
**A:** Android Studio需要约10GB空间。如果空间不足，选择方案二可以节省一些空间。

### Q: 安装后还是构建失败？
**A:** 请检查：
1. 环境变量是否正确配置（运行 `echo $ANDROID_HOME`）
2. 重启终端让环境变量生效
3. 确保JDK版本 >= 11

---

## 🆘 需要帮助？

如果安装过程中遇到问题：

1. 截图或复制错误信息
2. 告诉我你选择的方案
3. 告诉我执行到哪一步

我会帮你解决！

---

## 🚀 下一步

完成环境配置后，告诉我"环境已配置好"，我会立即帮你构建APK！

---

**推荐：先安装Android Studio，这是最简单可靠的方式！** 🎯
