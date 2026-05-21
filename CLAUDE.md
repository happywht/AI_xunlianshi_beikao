# AGENT

This file provides guidance to ANY CODING AGENT when working with code in this repository.

## 项目概述

「人工智能训练师三级」备考刷题系统，支持顺序练习、随机刷题、错题本、跨设备同步等功能。

## 常用命令

```bash
# 构建题库（从 Markdown 生成 questions.json）
npm run build

# 本地预览（需要全局安装 http-server 或类似工具）
npx http-server deploy -p 8080
```

## 技术栈

- **前端**: 纯 HTML + CSS + JavaScript 单文件应用
- **数据库**: Firebase Realtime Database（用于跨设备同步）
- **部署**: Netlify 静态托管

## 项目结构

```
├── 题库md转换/           # 源题库 Markdown 文件
│   ├── 单选题.md
│   ├── 多选题.md
│   └── 判断题.md
├── build.mjs            # 构建脚本：解析 Markdown → questions.json
└── deploy/              # 部署目录
    ├── index.html       # 主页面
    ├── app.js           # 应用逻辑（约 1400 行）
    ├── style.css        # 样式
    └── questions.json   # 题库数据（构建生成）
```

## 代码架构

`deploy/app.js` 采用模块化 IIFE 模式，主要模块：

| 模块 | 职责 |
|------|------|
| `Storage` | localStorage 存储，管理进度、历史、错题 |
| `Sync` | Firebase 同步，6 位房间码配对 |
| `State` | 应用状态管理（当前题号、模式、分类） |
| `UI` | DOM 渲染、事件绑定、弹窗交互 |
| `App` | 主模块，初始化和业务逻辑 |

### 数据流

1. `build.mjs` 读取 `题库md转换/*.md`，解析后写入 `deploy/questions.json`
2. `app.js` 运行时通过 `fetch('questions.json')` 加载题库
3. 用户答题数据存储在 localStorage，通过 Sync 模块与 Firebase 同步

### 题库格式

questions.json 中的题目结构：
```json
{
  "id": 1,
  "type": "single|multi|judge",
  "question": "题目文本",
  "options": [{"label": "A", "text": "选项文本"}],
  "answer": "A",
  "explanation": "解析"
}
```

## 开发注意事项

- 修改题库内容需先编辑 `题库md转换/` 下的 Markdown 文件，然后运行 `npm run build`
- 修改界面样式直接编辑 `deploy/style.css`
- 修改逻辑功能编辑 `deploy/app.js`
- 题目类型支持：判断题(√/×)、单选题(A-E)、多选题(A-E 组合)
