#!/bin/bash

echo "========================================="
echo "⚠️  构建环境检查"
echo "========================================="
echo ""

# 检查Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js未安装"
    echo "   请访问: https://nodejs.org/"
    exit 1
fi

# 检查Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "⚠️  Java: $JAVA_VERSION"
    echo "   注意: 构建Android需要JDK 11+"
else
    echo "❌ Java未正确配置"
fi

# 检查Android SDK
if [ -d "$ANDROID_HOME" ]; then
    echo "✅ Android SDK: $ANDROID_HOME"
elif [ -d "$HOME/Library/Android/sdk" ]; then
    echo "⚠️  Android SDK位置: $HOME/Library/Android/sdk"
    echo "   建议设置环境变量 ANDROID_HOME"
    export ANDROID_HOME="$HOME/Library/Android/sdk"
else
    echo "❌ Android SDK未找到"
    echo ""
    echo "========================================="
    echo "📋 需要安装以下工具："
    echo "========================================="
    echo ""
    echo "1. ☕ Java Development Kit (JDK 11+)"
    echo "   下载: https://www.oracle.com/java/technologies/downloads/"
    echo "   或使用: brew install openjdk@17"
    echo ""
    echo "2. 🤖 Android Studio"
    echo "   下载: https://developer.android.com/studio"
    echo "   安装后会自动包含 Android SDK"
    echo ""
    echo "3. 配置环境变量 (添加到 ~/.zshrc 或 ~/.bash_profile):"
    echo "   export ANDROID_HOME=\$HOME/Library/Android/sdk"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/emulator"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    echo ""
    echo "========================================="
    echo "🔧 安装步骤："
    echo "========================================="
    echo ""
    echo "方法一：使用Android Studio（推荐）"
    echo "1. 下载并安装 Android Studio"
    echo "2. 打开 Android Studio > Settings > SDK Manager"
    echo "3. 安装 Android SDK (API 34)"
    echo "4. 安装 Android SDK Build-Tools"
    echo "5. 配置环境变量"
    echo ""
    echo "方法二：仅命令行工具"
    echo "1. 安装 Xcode Command Line Tools:"
    echo "   xcode-select --install"
    echo "2. 安装 JDK:"
    echo "   brew install openjdk@17"
    echo "3. 下载 Android Command Line Tools"
    echo "   https://developer.android.com/studio#command-tools"
    echo ""
    exit 1
fi

echo ""
echo "========================================="
echo "✅ 环境检查通过，可以开始构建"
echo "========================================="
