# React 学习入门指南

欢迎来到 React 学习项目！本项目旨在帮助你系统地学习 React，提供详细的笔记和示例代码。

## 项目结构

-   `notes/` - 包含所有的学习笔记，采用 Markdown 格式，适合在 Obsidian 中查看
-   `example/` - 包含可运行的示例项目，展示 React 的基本功能
-   `catalogue.md` - 完整的学习大纲
-   `prompts/` - 存放与 AI 助手交互的提示词模板

## 如何开始学习

### 1. 阅读笔记

首先，建议阅读`notes/`目录中的笔记文件，按照顺序学习：

1. [[notes/01-起步基础/01-什么是React|什么是 React]]
2. [[notes/01-起步基础/02-React开发环境搭建|React 开发环境搭建]]
3. [[notes/01-起步基础/03-JSX语法介绍|JSX 语法介绍]]
4. [[notes/02-核心概念/01-组件和Props/01-组件和Props概述|组件和 Props]]

提示：建议使用 Obsidian 应用来查看这些笔记，以充分利用内部链接和标签功能。

### 2. 运行示例项目

在学习理论知识的同时，可以尝试运行和修改示例项目：

```bash
# 进入示例项目目录
cd example

# 安装依赖
npm install

# 启动开发服务器
npm start
```

这将启动一个 Todo 应用，你可以在浏览器中访问 http://localhost:3000 查看效果。

### 3. 动手实践

学习编程最有效的方法是动手实践。在理解了基本概念后，尝试：

-   修改示例项目
-   添加新功能
-   创建自己的 React 项目

### 4. 查看学习大纲

完整的学习大纲在[catalogue.md](catalogue.md)文件中。它列出了从基础到高级的所有学习主题，你可以根据大纲规划自己的学习进度。

## 与 AI 助手交互

本项目设计了与 AI 助手交互的方式来辅助学习：

1. 使用`prompts/role.md`中定义的角色提示
2. 按照循序渐进的方式提问
3. 要求 AI 助手解释概念、分析代码或提供实例

示例提问：

```
请使用prompts/role.md中的角色，帮我理解React中的useEffect Hook。
```

## 扩展学习资源

除了本项目提供的内容外，以下资源也非常有价值：

-   [React 官方文档](https://reactjs.org/docs/getting-started.html)
-   [React 官方教程](https://reactjs.org/tutorial/tutorial.html)
-   [MDN 的 React 教程](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started)

## 注意事项

-   学习编程需要耐心和实践
-   不要试图一次性理解所有概念
-   遇到问题时，多查阅文档和搜索解决方案
-   定期复习已学内容

祝你学习愉快！
