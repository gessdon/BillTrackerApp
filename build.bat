@echo off
REM 智能记账APP - Windows构建脚本

echo =========================================
echo 📱 智能记账APP - 构建脚本
echo =========================================
echo.

REM 1. 安装依赖
echo 📦 步骤 1/4: 安装npm依赖...
call npm install

if %errorlevel% neq 0 (
    echo ❌ npm依赖安装失败
    exit /b 1
)

echo ✅ npm依赖安装完成
echo.

REM 2. 清理Android构建缓存
echo 🧹 步骤 2/4: 清理Android构建缓存...
cd android
call gradlew.bat clean
cd ..

echo ✅ 缓存清理完成
echo.

REM 3. 构建Debug APK
echo 🔨 步骤 3/4: 构建Debug APK...
cd android
call gradlew.bat assembleDebug

if %errorlevel% neq 0 (
    echo ❌ APK构建失败
    exit /b 1
)

cd ..

echo ✅ APK构建完成
echo.

REM 4. 复制APK到根目录
echo 📋 步骤 4/4: 复制APK文件...
copy android\app\build\outputs\apk\debug\app-debug.apk 智能记账.apk

if exist "智能记账.apk" (
    echo ✅ APK文件已生成: 智能记账.apk
    echo.
    echo =========================================
    echo 🎉 构建成功！
    echo =========================================
    echo.
    echo 📱 APK位置: %cd%\智能记账.apk
    echo.
    echo 📝 安装说明:
    echo 1. 将APK文件传输到Android设备
    echo 2. 在设备上找到APK文件并点击安装
    echo 3. 如提示需要允许未知来源，请在设置中允许
    echo.
    echo 💡 如需直接安装到连接的设备，运行:
    echo    adb install -r 智能记账.apk
    echo.
) else (
    echo ❌ APK文件复制失败
    exit /b 1
)

pause
