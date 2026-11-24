#!/bin/bash
# ============================================================================
# 服务器一键部署脚本（在服务器上、项目目录内执行：bash scripts/deploy.sh）
#
# 前提：
#   1. 已通过 git clone 把仓库拉到服务器
#   2. 项目根目录已创建 .env.local（数据库连接 + 后台密码，模板见 .env.example）
#   3. 数据库已导入 database/schema.mysql.sql 和 seed.mysql.sql
#   4. 服务器已装 Node 20+ 和 pm2（npm i -g pm2）
# ============================================================================
set -e

cd "$(dirname "$0")/.."

echo "==> 拉取最新代码"
git pull

echo "==> 安装依赖"
npm install

echo "==> 构建（SSG 页面在构建时查数据库，.env.local 必须已配置）"
npm run build

echo "==> 重启服务"
if pm2 describe blog > /dev/null 2>&1; then
  pm2 restart blog
else
  pm2 start npm --name blog -- start
  pm2 save
fi

echo ""
echo "==> 部署完成！"
pm2 status blog
