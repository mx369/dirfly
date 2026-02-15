# dirfly

用于将本地目录同步到指定`SVN`仓库。

## 安装与运行

无需全局安装，直接使用 `npx`：

```bash
npx dirfly [localPath] <repoUrl> [repoSubDir]
```

### 参数说明

| 参数             | 是否必填 | 默认值            | 描述                                         |
| -------------- | ---- | -------------- | ------------------------------------------ |
| `[localPath]`  | 可选   | 当前工作目录 (`cwd`) | 本地目录路径，可以是相对或绝对路径                          |
| `<repoUrl>`    | 必填   | —              | 仓库地址，例如 `https://github.com/user/repo.git` |
| `[repoSubDir]` | 可选   | 本地目录名          | 仓库内的目标子目录名称，不指定时自动使用本地目录名                  |

---

## 使用示例

### 1. 使用当前目录上传

```bash
cd ./my-project
npx dirfly https://github.com/user/repo.git
```

* 使用当前目录作为 `[localPath]`
* 仓库子目录默认使用 `my-project`

---

### 2. 指定本地目录

```bash
npx dirfly ./dist https://github.com/user/repo.git
```

* `[localPath]` = `./dist`
* `[repoSubDir]` 未指定，默认使用 `dist`

---

### 3. 指定本地目录和仓库子目录

```bash
npx dirfly ./dist https://github.com/user/repo.git frontend
```

* `[localPath]` = `./dist`
* `[repoSubDir]` = `frontend`


## 依赖

本工具依赖 SVN 命令行工具。可以在下面的页面查找或下载适合您平台的 SVN 客户端：

- https://tortoisesvn.net/downloads.zh.html — 在该页面可以直接下载适用于不同系统架构的安装包（例如 32-bit、64-bit、ARM64）
- macOS / Linux：推荐通过包管理器安装 `subversion`（例如 macOS 使用 `brew install subversion`），或查看 Apache Subversion 官方包列表：https://subversion.apache.org/packages.html

安装完成后，请在终端中确认 `svn` 可用：

```bash
svn --version
```

---

## SVN 服务（托管与私有仓库）

下面列出了一些可以托管 SVN 仓库或提供 SVN 服务的平台供参考：

- 国际：SourceForge（https://sourceforge.net）
- gitee.com : 支持git  SVN 二合一仓库
- svnbucket（https://svnbucket.com） — 支持绑定微信，提供免费与付费套餐，适合需要国内支付/本地化支持的团队

svnbucket 示例套餐（仅供参考，以服务商官网为准）：
- 免费版：
	- ￥0/月
	- 100M 仓库空间
	- 不限私有项目数量
	- 不限项目成员数量
---

## 注意事项

1. `[localPath]` 必须存在，否则命令会报错。
2. `<repoUrl>` 必填，SVN仓库地址。
3. `[repoSubDir]` 未填时默认使用本地目录名。
4. 支持相对路径和绝对路径，兼容 Windows / macOS / Linux。
5. 路径或子目录名中含空格时请使用双引号，例如：

```bash
npx dirfly "C:\My Project\dist" "https://github.com/user/repo.git" "frontend dir"
```

---

## 推荐用法

```bash
# 使用当前目录，默认子目录
npx dirfly <repoUrl>

# 指定本地目录，自动使用目录名作为仓库子目录
npx dirfly ./dist <repoUrl>

# 指定本地目录和仓库子目录
npx dirfly ./dist <repoUrl> frontend
```


# Git 与 SVN 常用命令对比（按使用频率排序）

> 按照日常开发中的使用频率从高到低排列

## 🔥 最高频命令（日常必用）

### 1. 查看状态与差异
**使用频率：★★★★★ 每天多次**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 查看工作区状态 | `git status` | `svn status` | 显示修改的文件 |
| 查看文件差异 | `git diff` | `svn diff` | 显示具体的代码变更 |
| 查看提交历史 | `git log --oneline` | `svn log` | 显示提交记录 |

### 2. 日常更新与提交
**使用频率：★★★★★ 每天多次**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 更新到最新版本 | `git pull` | `svn update` | 获取团队最新代码 |
| 添加文件到版本控制 | `git add <file>` | `svn add <file>` | 标记新文件 |
| 提交代码更改 | `git commit -m "<message>"` | `svn commit -m "<message>"` | 提交本地修改 |

### 3. 推送与同步
**使用频率：★★★★☆ 每天多次**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 推送本地提交 | `git push` | （已内置于 commit） | 同步到远程仓库 |
| 查看远程仓库 | `git remote -v` | `svn info` | 显示仓库信息 |

## ⚡ 中频命令（经常使用）

### 4. 文件操作
**使用频率：★★★☆☆ 每周多次**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 删除文件 | `git rm <file>` | `svn rm <file>` | 删除文件 |
| 重命名/移动文件 | `git mv <old> <new>` | `svn mv <old> <new>` | 移动或重命名 |

### 5. 分支操作（基础）
**使用频率：★★★☆☆ 每周多次**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 切换分支 | `git checkout <branch>`<br>`git switch <branch>` | `svn switch <branch-url>` | 切换到指定分支 |
| 创建分支 | `git branch <branch>`<br>`git checkout -b <branch>` | `svn copy <trunk-url> <branch-url>` | 创建新分支 |

## 🚀 中低频命令（偶尔使用）

### 6. 分支管理（高级）
**使用频率：★★☆☆☆ 每月几次**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 查看分支列表 | `git branch -a` | `svn list <repo-url>/branches` | 显示所有分支 |
| 合并分支 | `git merge <branch>` | `svn merge <branch-url>` | 合并代码 |
| 删除分支 | `git branch -d <branch>` | `svn rm <branch-url>` | 删除分支 |

### 7. 版本回退
**使用频率：★★☆☆☆ 每月几次**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 撤销本地修改 | `git checkout -- <file>`<br>`git restore <file>` | `svn revert <file>` | 放弃未提交的更改 |
| 回滚到指定版本 | `git checkout <commit-id>` | `svn update -r <revision>` | 切换到历史版本 |

## 🛠️ 低频命令（功能维护）

### 8. 仓库初始化
**使用频率：★☆☆☆☆ 项目初期**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 初始化仓库 | `git init` | `svnadmin create <repo>` | 新建仓库 |
| 克隆仓库 | `git clone <repo>` | `svn checkout <repo>` | 获取现有仓库 |

### 9. 标签管理
**使用频率：★☆☆☆☆ 发布版本时**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 创建标签 | `git tag <tag>` | `svn copy <trunk-url> <tag-url>` | 创建版本标签 |
| 切换到标签 | `git checkout <tag>` | `svn switch <tag-url>` | 切换到标签版本 |

### 10. 高级功能
**使用频率：★☆☆☆☆ 特殊需要时**

| 操作 | Git 命令 | SVN 命令 | 说明 |
|------|----------|----------|------|
| 查看特定版本文件 | `git show <commit>:<file>` | `svn cat <file>@<revision>` | 查看历史文件 |
| 忽略文件配置 | `.gitignore` 文件 | `svn propset svn:ignore` | 设置忽略规则 |
| 撤销特定提交 | `git revert <commit>` | `svn merge -c -<revision>` | 回退指定提交 |

## 📊 使用场景总结

### 日常开发工作流（90%场景）
```
# Git 工作流
git pull                  # 更新
git status                # 查看状态
git add .                 # 添加修改
git commit -m "msg"      # 提交
git push                  # 推送

# SVN 工作流  
svn update                # 更新
svn status                # 查看状态
svn add <files>          # 添加新文件
svn commit -m "msg"      # 提交并推送
```

### 关键差异提醒
- **Git** 分两步：`commit`（本地）→ `push`（远程）
- **SVN** 一步到位：`commit`（直接到服务器）
- **分支成本**：Git 分支是轻量级指针，SVN 分支是完整拷贝
- **离线工作**：Git 可完全离线，SVN 依赖网络连接
