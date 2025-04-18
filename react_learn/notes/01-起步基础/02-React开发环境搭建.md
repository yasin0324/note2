# React 开发环境搭建

#环境配置 #工具 #前端开发

React 应用的开发环境可以通过多种方式进行搭建，本笔记将介绍几种常见的搭建方法，并提供详细的步骤说明。

## 前置要求

在开始设置 React 开发环境之前，请确保你的计算机上已安装以下工具：

1. **Node.js** (推荐 v14.0.0 以上版本)
2. **npm** (通常随 Node.js 一起安装)或**yarn**
3. **代码编辑器** (推荐 Visual Studio Code)

你可以通过以下命令检查是否已正确安装 Node.js 和 npm：

```bash
node -v  # 查看Node.js版本
npm -v   # 查看npm版本
```

## 方法一：使用 Create React App

Create React App (CRA)是官方推荐的创建新的单页 React 应用的方式，它提供了一个零配置的现代构建设置。

### 步骤：

1. **创建新应用**：

```bash
npx create-react-app my-app
# 或使用TypeScript模板
npx create-react-app my-app --template typescript
```

2. **进入项目目录**：

```bash
cd my-app
```

3. **启动开发服务器**：

```bash
npm start
# 或
yarn start
```

应用将在 http://localhost:3000 自动打开。

### CRA 的主要特点：

-   零配置，开箱即用
-   内置热重载
-   自动化测试支持
-   生产环境构建优化
-   支持 CSS 模块、Sass 等
-   支持 PWA 特性

## 方法二：使用 Vite

Vite 是一个更现代化的前端构建工具，提供更快的开发服务器启动和热模块替换(HMR)。

### 步骤：

1. **创建项目**：

```bash
npm create vite@latest my-react-app -- --template react
# 或使用TypeScript
npm create vite@latest my-react-app -- --template react-ts
```

2. **进入项目目录并安装依赖**：

```bash
cd my-react-app
npm install
```

3. **启动开发服务器**：

```bash
npm run dev
```

应用将在 http://localhost:5173 (或其他端口) 运行。

### Vite 的主要特点：

-   极快的服务器启动
-   即时的热模块替换
-   真正的按需编译
-   优化的生产构建
-   开箱即用的 TypeScript 支持

## 方法三：使用 Next.js

如果你想构建服务端渲染或静态生成的 React 应用，Next.js 是一个理想的选择。

### 步骤：

1. **创建项目**：

```bash
npx create-next-app@latest my-next-app
# 或使用TypeScript
npx create-next-app@latest my-next-app --typescript
```

2. **进入项目目录**：

```bash
cd my-next-app
```

3. **启动开发服务器**：

```bash
npm run dev
```

应用将在 http://localhost:3000 运行。

### Next.js 的主要特点：

-   服务端渲染(SSR)
-   静态站点生成(SSG)
-   自动代码分割
-   基于文件系统的路由
-   API 路由支持
-   内置 CSS 和 Sass 支持

## 方法四：手动配置 Webpack

对于需要更高度自定义构建过程的项目，可以手动配置 Webpack：

### 步骤：

1. **创建项目目录**：

```bash
mkdir my-react-app
cd my-react-app
npm init -y
```

2. **安装必要的依赖**：

```bash
npm install react react-dom
npm install --save-dev webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin
```

3. **创建配置文件**：

    - webpack.config.js
    - .babelrc
    - public/index.html
    - src/index.js

4. **添加 npm 脚本**：

在 package.json 中添加：

```json
"scripts": {
  "start": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

5. **启动开发服务器**：

```bash
npm start
```

## 扩展工具和设置

### 编辑器插件(VSCode)

以下 VSCode 插件可以极大提升 React 开发体验：

-   **ESLint**：代码质量检查
-   **Prettier**：代码格式化
-   **ES7+ React/Redux/React-Native snippets**：React 代码片段
-   **Auto Import**：自动导入组件
-   **Path Intellisense**：路径自动补全

### 开发工具

-   **React Developer Tools**：React 调试的浏览器扩展
-   **Redux DevTools**：状态管理调试工具(如使用 Redux)

### 其他有用的配置

-   **ESLint 配置**：`.eslintrc.js`
-   **Prettier 配置**：`.prettierrc`
-   **TypeScript 配置**：`tsconfig.json`
-   **Jest 测试配置**：`jest.config.js`

## 选择最佳方案

-   **初学者/中小型项目**：Create React App
-   **追求极速开发体验**：Vite
-   **需要 SSR/SSG**：Next.js
-   **特定定制需求**：手动配置 Webpack

## 后续学习路径

接下来，我们将学习：

1. [[03-JSX语法介绍|JSX语法介绍]] - 学习 React 的 JSX 语法

## 参考链接

-   [Create React App 官方文档](https://create-react-app.dev/)
-   [Vite 官方文档](https://vitejs.dev/)
-   [Next.js 官方文档](https://nextjs.org/)
