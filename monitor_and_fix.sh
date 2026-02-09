#!/bin/bash

# GitHub Actions 自动监测和修复脚本
# 功能: 定期检查工作流状态,自动识别错误并修复
#
# 使用方法:
#   export GITHUB_TOKEN="你的Token"
#   ./monitor_and_fix.sh

set -e

# ============== 配置 ==============
REPO_OWNER="${REPO_OWNER:-gessdon}"
REPO_NAME="${REPO_NAME:-BillTrackerApp}"
TOKEN="${GITHUB_TOKEN}"  # 从环境变量获取
CHECK_INTERVAL=300  # 5分钟(秒)

PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
LOG_FILE="$PROJECT_DIR/monitor.log"
LAST_RUN_FILE="$PROJECT_DIR/.last_run_id"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============== 函数 ==============

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# 获取最新工作流运行
get_latest_workflow() {
    local api_url="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=1"
    curl -s -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json" "$api_url"
}

# 获取工作流详情
get_workflow_details() {
    local run_id=$1
    local api_url="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs/${run_id}"
    curl -s -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json" "$api_url"
}

# 获取工作流日志
get_workflow_logs() {
    local run_id=$1
    local api_url="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs/${run_id}/logs"
    curl -s -H "Accept: application/vnd.github+json" -H "Authorization: token $TOKEN" "$api_url" > "$PROJECT_DIR/.workflow_logs.txt"

    if grep -q "Must have admin rights" "$PROJECT_DIR/.workflow_logs.txt"; then
        return 1
    fi
    return 0
}

# 从网页获取日志
get_web_logs() {
    local run_id=$1
    local url="https://github.com/${REPO_OWNER}/${REPO_NAME}/actions/runs/${run_id}"
    warning "请访问 $url 查看详细日志"
}

# 分析错误
analyze_error() {
    local log_file="$PROJECT_DIR/.workflow_logs.txt"

    # 检查常见错误
    if grep -q "cannot find symbol.*PackageList" "$log_file" 2>/dev/null; then
        echo "PACKAGELIST_NOT_FOUND"
    elif grep -q "Unresolved reference: libs" "$log_file" 2>/dev/null; then
        echo "LIBS_UNRESOLVED"
    elif grep -q "could not find.*react-native" "$log_file" 2>/dev/null; then
        echo "REACT_NATIVE_NOT_FOUND"
    elif grep -q "cannot find symbol.*BuildConfig" "$log_file" 2>/dev/null; then
        echo "BUILDCONFIG_NOT_FOUND"
    elif grep -q "BUILD FAILED" "$log_file" 2>/dev/null; then
        echo "BUILD_FAILED"
    else
        echo "UNKNOWN"
    fi
}

# 修复 PackageList 错误
fix_packagelist_error() {
    log "修复: 添加 react-native 依赖到 build.gradle"
    cd "$PROJECT_DIR"

    local build_gradle="android/app/build.gradle"

    if grep -q "implementation 'com.facebook.react:react-native:" "$build_gradle"; then
        log "react-native 依赖已存在"
        return 0
    fi

    # 在 dependencies 块中添加依赖
    sed -i.bak '/dependencies {/a\
\
    // React Native - 包含 PackageList 支持\
    implementation '"'"'com.facebook.react:react-native:0.73.2'"'"''
    "$build_gradle"

    rm -f "${build_gradle}.bak"
    log "✅ 已添加 react-native 依赖"
    return 1
}

# 修复 libs 引用错误
fix_libs_error() {
    log "修复: 移除不必要的 react-native 模块引用"
    cd "$PROJECT_DIR"

    local settings_gradle="android/settings.gradle"

    if ! grep -q "include ':react-native'" "$settings_gradle"; then
        log "settings.gradle 中没有需要移除的内容"
        return 0
    fi

    # 移除 include ':react-native' 及其后面的几行
    sed -i.bak '/include '"'"':react-native'"'"'/,/project.*react-native.*$/d' "$settings_gradle"
    rm -f "${settings_gradle}.bak"
    log "✅ 已移除不必要的 react-native 模块引用"
    return 1
}

# 检查 NDK 配置
check_ndk_config() {
    log "修复: 添加 NDK 配置"
    cd "$PROJECT_DIR"

    local build_gradle="android/app/build.gradle"

    if grep -q "ndk {" "$build_gradle"; then
        log "NDK 配置已存在"
        return 0
    fi

    # 在 defaultConfig 中添加 NDK 配置
    sed -i.bak '/versionName "1.0"/a\
\
        ndk {\
            abiFilters '"'"'armeabi-v7a, arm64-v8a, x86, x86_64'"'"'\
        }'
    "$build_gradle"

    rm -f "${build_gradle}.bak"
    log "✅ 已添加 NDK 配置"
    return 1
}

# 提交修复
commit_fix() {
    local message="$1"
    log "提交修复: $message"
    cd "$PROJECT_DIR"

    git add -A
    git commit -m "$message"

    # 推送
    git push origin main

    if [ $? -eq 0 ]; then
        log "✅ 修复已推送到 GitHub"
        return 0
    else
        error "推送失败"
        return 1
    fi
}

# 主函数
main() {
    log "═════════════════════════════════════════════════════"
    log "GitHub Actions 自动监测和修复机器人"
    log "═════════════════════════════════════════════════════"

    while true; do
        info "检查工作流状态..."

        # 获取最新工作流
        workflow_json=$(get_latest_workflow)

        # 提取关键信息
        run_id=$(echo "$workflow_json" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
        status=$(echo "$workflow_json" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
        conclusion=$(echo "$workflow_json" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)
        head_branch=$(echo "$workflow_json" | grep -o '"head_branch":"[^"]*"' | head -1 | cut -d'"' -f4)

        if [ -z "$run_id" ]; then
            warning "无法获取工作流信息,等待下次检查..."
            sleep $CHECK_INTERVAL
            continue
        fi

        info "工作流 #${run_id} - 分支: ${head_branch} - 状态: ${status}"

        # 检查是否是新的运行
        if [ -f "$LAST_RUN_FILE" ]; then
            last_run_id=$(cat "$LAST_RUN_FILE")
            if [ "$run_id" = "$last_run_id" ]; then
                info "工作流 ${run_id} 已处理过,跳过"
                sleep $CHECK_INTERVAL
                continue
            fi
        fi
        echo "$run_id" > "$LAST_RUN_FILE"

        # 等待工作流完成
        if [ "$status" = "in_progress" ] || [ "$status" = "queued" ]; then
            info "工作流正在运行中,等待完成..."
            sleep 30
            continue
        fi

        # 检查结论
        if [ "$conclusion" = "success" ]; then
            log "✅ 工作流 #${run_id} 构建成功!"
            sleep $CHECK_INTERVAL
            continue
        elif [ "$conclusion" = "failure" ]; then
            error "❌ 工作流 #${run_id} 构建失败!"

            # 获取日志
            if get_workflow_logs "$run_id"; then
                log "成功获取工作流日志"
            else
                warning "无法获取详细日志,请手动检查"
                get_web_logs "$run_id"
                sleep $CHECK_INTERVAL
                continue
            fi

            # 分析错误
            error_type=$(analyze_error)
            log "检测到错误类型: $error_type"

            # 根据错误类型修复
            case "$error_type" in
                "PACKAGELIST_NOT_FOUND")
                    if fix_packagelist_error; then
                        commit_fix "修复: 添加 react-native 依赖解决 PackageList 错误"
                    fi
                    ;;
                "LIBS_UNRESOLVED")
                    if fix_libs_error; then
                        commit_fix "修复: 移除不必要的 react-native 模块引用"
                    fi
                    ;;
                "BUILDCONFIG_NOT_FOUND")
                    if check_ndk_config; then
                        commit_fix "修复: 添加 NDK 配置"
                    fi
                    ;;
                "BUILD_FAILED")
                    warning "无法自动识别的构建错误,需要手动检查"
                    get_web_logs "$run_id"
                    ;;
                "UNKNOWN")
                    warning "未知错误类型,需要手动检查"
                    get_web_logs "$run_id"
                    ;;
            esac
        else
            warning "未知的工作流结论: $conclusion"
        fi

        log "等待 ${CHECK_INTERVAL} 秒后下次检查..."
        sleep $CHECK_INTERVAL
    done
}

# 信号处理
trap 'log "收到中断信号,退出..."; exit 0' SIGINT SIGTERM

# 启动
main
