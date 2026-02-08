# 智能记账APP - 安装和运行指南

## 📱 项目介绍

这是一款基于React Native开发的智能记账应用，支持Android平台，具有OCR账单识别功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. Android环境准备

确保已安装：
- Android Studio
- JDK 11+
- Android SDK
- 已配置 ANDROID_HOME 环境变量

### 3. 启动Metro服务器

```bash
npm start
```

### 4. 运行Android应用

在新终端中执行：

```bash
npm run android
```

或手动启动：

1. 打开Android模拟器或连接真机
2. 执行 `npx react-native run-android`

## 📦 依赖说明

主要依赖包括：

- **react-native**: 0.73.2 - React Native核心框架
- **@react-navigation**: 导航库
- **react-native-paper**: Material Design UI组件
- **@react-native-async-storage/async-storage**: 本地存储
- **react-native-chart-kit**: 图表库
- **react-native-image-picker**: 图片选择器
- **react-native-vector-icons**: 图标库

## 🔧 常见问题

### Android编译错误

如果遇到编译错误，尝试：

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Metro缓存问题

```bash
npm start -- --reset-cache
```

### 图标不显示

```bash
npx react-native-asset
```

## 📝 注意事项

1. **OCR功能**: 当前为演示版本，使用模拟数据。生产环境需集成真实OCR服务。

2. **权限**: 应用需要以下权限：
   - 读取存储权限（选择图片）
   - 相机权限（拍照）
   - 网络权限（未来云同步）

3. **iOS开发**: 如需iOS版本，需要：
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

## 🎯 功能清单

- ✅ 账单列表展示
- ✅ 添加收入/支出
- ✅ 智能分类
- ✅ 数据统计图表
- ✅ OCR扫描识别（演示）
- ✅ 本地数据持久化
- ✅ 长按删除账单

## 📱 测试应用

1. 打开应用后，可以在"添加"页面手动添加账单
2. 在"扫描"页面选择图片进行OCR识别（当前为模拟数据）
3. 在"统计"页面查看收支分析
4. 在"首页"查看所有账单记录

## 🔗 更多信息

查看 [README.md](./README.md) 了解完整功能和技术细节。

---

祝你使用愉快！🎉
