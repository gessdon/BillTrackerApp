#!/bin/bash

# 分步执行脚本 - 每步需要用户确认

echo "========================================="
echo "🚀 Expo构建 - 分步执行"
echo "========================================="
echo ""

echo "我会帮你逐步执行，遇到需要输入的地方会提示你。"
echo ""

# 步骤1: 安装EAS CLI
echo "----------------------------------------"
echo "步骤1: 安装EAS CLI"
echo "----------------------------------------"
echo "运行命令: npm install -g eas-cli"
echo ""
read -p "按回车键开始安装..." dummy
npm install -g eas-cli

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 安装成功！"
else
    echo ""
    echo "❌ 安装失败，请检查网络连接"
    exit 1
fi

echo ""
read -p "按回车键继续..." dummy
echo ""

# 步骤2: 登录
echo "----------------------------------------"
echo "步骤2: 登录Expo账号"
echo "----------------------------------------"
echo ""
echo "如果你已有账号，请准备好邮箱和密码"
echo "如果没有账号，请访问: https://expo.dev/signup"
echo ""
read -p "准备好了？按回车键开始登录..." dummy
echo ""
eas login

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 登录成功！"
    echo "当前用户: $(eas whoami)"
else
    echo ""
    echo "❌ 登录失败"
    exit 1
fi

echo ""
read -p "按回车键继续..." dummy
echo ""

# 步骤3: 进入项目
echo "----------------------------------------"
echo "步骤3: 进入项目目录"
echo "----------------------------------------"
cd /Users/myc/CodeBuddy/20260209021715
echo "✅ 已进入: $(pwd)"
echo ""
read -p "按回车键继续..." dummy
echo ""

# 步骤4: 配置项目
echo "----------------------------------------"
echo "步骤4: 配置项目"
echo "----------------------------------------"
echo "运行命令: eas build:configure"
echo ""
read -p "按回车键开始配置..." dummy
echo ""

# 检查是否已配置
if eas project:info > /dev/null 2>&1; then
    echo "✅ 项目已配置"
else
    echo "首次配置，创建新项目..."
    eas build:configure
fi

echo ""
read -p "按回车键继续..." dummy
echo ""

# 步骤5: 构建
echo "----------------------------------------"
echo "步骤5: 构建APK"
echo "----------------------------------------"
echo ""
echo "⏳ 即将开始构建，需要10-15分钟"
echo "   你可以关闭此窗口，构建会在云端继续"
echo ""
read -p "确认开始构建？按回车键..." dummy
echo ""

eas build --platform android --profile preview

echo ""
echo "========================================="
echo "🎉 完成！"
echo "========================================="
echo ""
echo "请查看上方的下载链接，或访问:"
echo "https://expo.dev"
echo ""
