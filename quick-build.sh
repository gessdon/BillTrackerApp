#!/bin/bash

echo "========================================="
echo "🚀 智能记账APP - 快速构建"
echo "========================================="
echo ""
echo "正在为您构建APK，请稍候..."
echo ""

# 检查环境
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

if [ ! -d "$ANDROID_HOME" ]; then
    echo "⚠️  警告: 未检测到ANDROID_HOME环境变量"
    echo "请确保已安装Android Studio和Android SDK"
    echo ""
fi

# 1. 安装依赖
echo "📦 [1/4] 安装依赖..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败，请检查网络连接"
    exit 1
fi

echo "✅ 依赖安装完成"
echo ""

# 2. 赋予gradlew执行权限
echo "🔧 [2/4] 配置构建环境..."
chmod +x android/gradlew

# 3. 清理并构建
echo "🔨 [3/4] 开始构建APK (这可能需要5-15分钟)..."
cd android
./gradlew clean assembleDebug --no-daemon

if [ $? -ne 0 ]; then
    echo "❌ APK构建失败"
    echo ""
    echo "常见解决方案："
    echo "1. 确保已安装Android Studio和Android SDK"
    echo "2. 配置ANDROID_HOME环境变量"
    echo "3. 检查JDK版本 (需要JDK 11+)"
    exit 1
fi

cd ..

# 4. 复制APK
echo "📋 [4/4] 准备APK文件..."
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    cp android/app/build/outputs/apk/debug/app-debug.apk ./智能记账.apk
    
    APK_SIZE=$(ls -lh 智能记账.apk | awk '{print $5}')
    
    echo ""
    echo "========================================="
    echo "🎉 构建成功！"
    echo "========================================="
    echo ""
    echo "📱 APK文件信息:"
    echo "   位置: $(pwd)/智能记账.apk"
    echo "   大小: $APK_SIZE"
    echo ""
    echo "📲 安装方法:"
    echo ""
    echo "方法1: 通过数据线传输"
    echo "   1. 连接手机到电脑"
    echo "   2. 复制APK到手机"
    echo "   3. 在手机上点击APK安装"
    echo ""
    echo "方法2: 通过微信/QQ发送"
    echo "   1. 将APK发送到手机微信/QQ"
    echo "   2. 下载后点击安装"
    echo ""
    echo "方法3: 通过云盘分享"
    echo "   1. 上传到百度云盘/阿里云盘"
    echo "   2. 手机端下载安装"
    echo ""
    echo "⚠️  安装提示:"
    echo "   - 允许安装未知来源应用"
    echo "   - 首次使用OCR需联网下载ML Kit模型"
    echo ""
else
    echo "❌ 未找到生成的APK文件"
    exit 1
fi
