#!/bin/bash

# 一键修复网络问题并重试安装

echo "========================================="
echo "🔧 修复网络并重试安装"
echo "========================================="
echo ""

# 尝试修复SSL问题
echo "1️⃣ 检查网络连接..."
ping -c 3 google.com > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 网络连接正常"
else
    echo "❌ 无法连接到Google服务器"
    echo "   可能需要配置代理或使用VPN"
    exit 1
fi

echo ""
echo "2️⃣ 尝试下载JDK..."

# 检查系统架构
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    JDK_URL="https://download.oracle.com/java/17/latest/jdk-17_macos-aarch64_bin.dmg"
    echo "检测到Apple Silicon (M1/M2)"
else
    JDK_URL="https://download.oracle.com/java/17/latest/jdk-17_macos-x64_bin.dmg"
    echo "检测到Intel处理器"
fi

echo "正在下载JDK..."
curl -L -o ~/Downloads/jdk-17.dmg "$JDK_URL"

if [ $? -eq 0 ]; then
    echo "✅ JDK下载成功！"
    echo "   位置: ~/Downloads/jdk-17.dmg"
    echo ""
    echo "📝 请手动安装："
    echo "   1. 打开访达，进入下载文件夹"
    echo "   2. 双击 jdk-17.dmg"
    echo "   3. 按照提示完成安装"
    echo ""
else
    echo "❌ JDK下载失败"
    echo ""
    echo "手动下载地址："
    echo "https://www.oracle.com/java/technologies/downloads/#jdk17-mac"
fi

echo ""
echo "3️⃣ 尝试下载Android Command Line Tools..."

CMDTOOLS_URL="https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip"
curl -L -o ~/Downloads/android-cmdtools.zip "$CMDTOOLS_URL"

if [ $? -eq 0 ]; then
    echo "✅ Android工具下载成功！"
    echo "   位置: ~/Downloads/android-cmdtools.zip"
    echo ""
    echo "📝 自动安装中..."
    
    # 解压并安装
    mkdir -p ~/android-sdk/cmdline-tools
    unzip -q ~/Downloads/android-cmdtools.zip -d ~/android-sdk/cmdline-tools/
    mv ~/android-sdk/cmdline-tools/cmdline-tools ~/android-sdk/cmdline-tools/latest
    
    # 配置环境变量
    export ANDROID_HOME=$HOME/android-sdk
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    
    echo "export ANDROID_HOME=\$HOME/android-sdk" >> ~/.zshrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin" >> ~/.zshrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.zshrc
    
    echo "✅ Android SDK已配置"
    echo ""
    echo "4️⃣ 安装必要的Android组件..."
    
    yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
    $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
    
    echo ""
    echo "========================================="
    echo "✅ 安装完成！"
    echo "========================================="
    echo ""
    echo "请重启终端，然后运行："
    echo "cd /Users/myc/CodeBuddy/20260209021715"
    echo "./quick-build.sh"
    
else
    echo "❌ Android工具下载失败"
    echo ""
    echo "手动下载地址："
    echo "https://developer.android.com/studio#command-tools"
fi

echo ""
echo "========================================="
echo "📋 安装进度总结"
echo "========================================="
echo ""
echo "Xcode Command Line Tools: ⏳ 等待用户确认安装"
echo "JDK: $(if [ -f ~/Downloads/jdk-17.dmg ]; then echo '✅ 已下载，待安装'; else echo '❌ 下载失败'; fi)"
echo "Android SDK: $(if [ -d ~/android-sdk ]; then echo '✅ 已安装'; else echo '❌ 待安装'; fi)"
