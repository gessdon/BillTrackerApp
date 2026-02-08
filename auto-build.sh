#!/bin/bash

# Expo自动构建脚本
# 此脚本会自动完成所有步骤

set -e  # 遇到错误立即退出

echo "========================================="
echo "🚀 Expo自动构建开始"
echo "========================================="
echo ""

# 步骤1: 安装EAS CLI
echo "📦 步骤1/5: 安装EAS CLI..."
npm install -g eas-cli
if [ $? -eq 0 ]; then
    echo "✅ EAS CLI安装成功"
else
    echo "❌ EAS CLI安装失败"
    exit 1
fi
echo ""

# 步骤2: 检查登录状态
echo "🔐 步骤2/5: 检查登录状态..."
if eas whoami > /dev/null 2>&1; then
    echo "✅ 已登录Expo账号"
    CURRENT_USER=$(eas whoami)
    echo "   当前用户: $CURRENT_USER"
else
    echo "❌ 未登录Expo账号"
    echo ""
    echo "⚠️  需要手动登录："
    echo "   请运行: eas login"
    echo "   或访问: https://expo.dev/signup 注册账号"
    echo ""
    exit 1
fi
echo ""

# 步骤3: 进入项目目录
echo "📂 步骤3/5: 进入项目目录..."
cd /Users/myc/CodeBuddy/20260209021715
echo "✅ 已进入项目目录"
echo ""

# 步骤4: 配置项目
echo "⚙️  步骤4/5: 配置项目..."
if [ ! -f "eas.json" ]; then
    echo "❌ 找不到eas.json配置文件"
    exit 1
fi
echo "✅ 配置文件已就绪"
echo ""

# 步骤5: 开始构建
echo "🔨 步骤5/5: 开始构建APK..."
echo "⏳ 这将需要10-15分钟，请耐心等待..."
echo ""
eas build --platform android --profile preview --non-interactive

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "🎉 构建成功！"
    echo "========================================="
    echo ""
    echo "📥 下载APK："
    echo "   - 查看上方的下载链接"
    echo "   - 或访问: https://expo.dev"
    echo ""
else
    echo ""
    echo "❌ 构建失败"
    echo ""
    echo "请检查错误信息，或告诉我具体的错误内容"
    exit 1
fi
