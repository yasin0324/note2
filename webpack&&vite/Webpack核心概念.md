# Webpack 核心概念与配置

本文档介绍 Webpack 的核心概念和基本配置，帮助你理解和使用这个强大的前端构建工具。

## 什么是 Webpack

Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。当 Webpack 处理应用程序时，它会在内部构建一个依赖图(dependency graph)，然后将项目中所需的每一个模块组合成一个或多个 bundle，它们均为静态资源，用于展示你的内容。

## 核心概念

### 入口(Entry)

入口起点指示 Webpack 应该使用哪个模块作为构建其内部依赖图的开始。Webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

```javascript
module.exports = {
    entry: "./src/index.js",
};
```

### 输出(Output)

输出属性告诉 Webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。

```javascript
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
};
```

### 加载器(Loaders)

Webpack 只能理解 JavaScript 和 JSON 文件，这是 Webpack 开箱可用的自带能力。Loader 让 Webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

```javascript
module.exports = {
    module: {
        rules: [
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.ts$/, use: "ts-loader" },
        ],
    },
};
```

### 插件(Plugins)

插件可以用于执行范围更广的任务，包括：打包优化、资源管理、注入环境变量等。

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
};
```

### 模式(Mode)

通过选择 `development`, `production` 或 `none` 之中的一个，来设置 `mode` 参数，你可以启用 Webpack 内置的优化，相应环境下的优化。

```javascript
module.exports = {
    mode: "production",
};
```

## 常用配置示例

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack App",
            template: "./src/index.html",
        }),
    ],
    devServer: {
        static: "./dist",
        hot: true,
    },
};
```

## 性能优化技巧

1. **代码分割**：将代码分割成不同的块，按需加载
2. **Tree Shaking**：移除未使用的代码
3. **懒加载**：按需加载模块
4. **缓存**：使用 contenthash 确保只有修改的文件才会重新构建

---

> [!tip] 提示
> Webpack 配置可能看起来复杂，但掌握了核心概念后，你就能根据项目需求进行灵活配置。

#Webpack #前端工程化 #构建工具
