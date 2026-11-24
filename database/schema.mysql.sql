-- ============================================================================
-- 个人博客数据库结构（MySQL 8.0+，宝塔面板可直接导入）
--
-- 使用方法（宝塔）：
--   1. 宝塔面板 → 数据库 → 添加数据库（记下库名、用户名、密码）
--   2. 点刚建的数据库 → 管理 → phpMyAdmin
--   3. 左侧选中你的数据库 → 上方“导入” → 选择本文件 → 执行
--   4. 再导入 database/seed.mysql.sql（种子数据）
--
-- 说明：
--   - id 自增，前台列表按 id 倒序（新的在前）；slug 唯一，作为网址后缀
--   - 权限控制在 API 层做（登录才能调写接口），不用数据库的 RLS
--   - updated_at 由 MySQL 自动维护（ON UPDATE CURRENT_TIMESTAMP）
--   - stack / tags 用 JSON 类型存数组，如 ["React", "Vite"]
-- ============================================================================

-- 如果通过 phpMyAdmin 导入时已经选中了数据库，下面两行会自动匹配；
-- 命令行导入时取消注释并改成你的库名：
-- CREATE DATABASE IF NOT EXISTS blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE blog;

-- ---- projects 表（项目）----
CREATE TABLE IF NOT EXISTS projects (
  id          INT NOT NULL AUTO_INCREMENT COMMENT '自增主键，决定排序（新的在前）',
  slug        VARCHAR(128) NOT NULL COMMENT '网址后缀，唯一',
  name        VARCHAR(255) NOT NULL COMMENT '项目名称',
  tagline     TEXT NOT NULL COMMENT '一句话介绍',
  year        VARCHAR(8) NOT NULL DEFAULT '' COMMENT '年份',
  status      ENUM('进行中', '已完成', '已归档') NOT NULL DEFAULT '进行中',
  stack       JSON NOT NULL COMMENT '技术栈数组，如 ["React", "Vite"]',
  featured    TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否首页置顶',
  icon        VARCHAR(64) NOT NULL DEFAULT 'wrench' COMMENT '封面图标名',
  demo_url    VARCHAR(512) NULL COMMENT '演示地址',
  repo_url    VARCHAR(512) NULL COMMENT '仓库地址',
  content     LONGTEXT NOT NULL COMMENT 'Markdown 正文',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_projects_slug (slug),
  INDEX idx_projects_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目';

-- ---- notes 表（笔记）----
CREATE TABLE IF NOT EXISTS notes (
  id          INT NOT NULL AUTO_INCREMENT COMMENT '自增主键，决定排序（新的在前）',
  slug        VARCHAR(128) NOT NULL COMMENT '网址后缀，唯一',
  title       VARCHAR(255) NOT NULL COMMENT '标题',
  excerpt     TEXT NOT NULL COMMENT '摘要',
  date        DATE NOT NULL COMMENT '发布日期',
  reading_time INT NOT NULL DEFAULT 3 COMMENT '阅读时长（分钟）',
  tags        JSON NOT NULL COMMENT '标签数组，如 ["React", "Hooks"]',
  content     LONGTEXT NOT NULL COMMENT 'Markdown 正文',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_notes_slug (slug),
  INDEX idx_notes_date (date DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='笔记';

-- ---- site_settings 表（站点设置，只有一行）----
CREATE TABLE IF NOT EXISTS site_settings (
  id          TINYINT UNSIGNED PRIMARY KEY DEFAULT 1 COMMENT '固定为 1，只有一行',
  site_title  VARCHAR(255) NOT NULL DEFAULT '我的博客',
  author_name VARCHAR(128) NOT NULL DEFAULT 'Alex',
  author_bio  TEXT NOT NULL,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_settings_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='站点设置';

-- ---- 初始设置行 ----
INSERT INTO site_settings (id, site_title, author_name, author_bio)
VALUES (1, '我的博客', 'Alex', '喜欢折腾各种小玩意的前端新手，正在学习 React。做点工具、写点笔记。')
ON DUPLICATE KEY UPDATE site_title = VALUES(site_title);
