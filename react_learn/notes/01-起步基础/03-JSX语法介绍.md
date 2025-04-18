# JSX 语法介绍

#语法 #基础 #React 核心概念

JSX（JavaScript XML）是 React 的核心特性之一，它是 JavaScript 的语法扩展，允许你在 JavaScript 文件中编写类似 HTML 的代码。本笔记将详细介绍 JSX 语法及其工作原理。

## 什么是 JSX？

JSX 是一种 JavaScript 的语法扩展，React 团队创造它是为了在 React 组件中更直观地描述 UI 应该呈现的样子。它看起来像 HTML，但拥有 JavaScript 的全部功能。

### 基本语法示例：

```jsx
const element = <h1>Hello, world!</h1>;
```

这段代码既不是字符串也不是 HTML，而是 JSX，React 用它来描述 UI 元素的外观。

## JSX 的工作原理

JSX 最终会被编译成普通的 JavaScript 函数调用，并对对象进行求值。这意味着你可以在`if`语句和`for`循环中使用 JSX，将其赋值给变量，接受它作为参数，以及从函数中返回它：

```jsx
// JSX代码
const element = <h1 className="greeting">Hello, world!</h1>;

// 编译后的JavaScript代码（简化版）
const element = React.createElement(
    "h1",
    { className: "greeting" },
    "Hello, world!"
);
```

`React.createElement()`会创建一个称为"React 元素"的对象，React 通过它了解需要在屏幕上显示什么内容。

## JSX 的基本规则

### 1. 必须有一个根元素包裹所有内容

JSX 表达式必须有一个单一的根元素：

```jsx
// 错误写法
const element = (
  <h1>Hello!</h1>
  <p>Welcome to React</p>
);

// 正确写法
const element = (
  <div>
    <h1>Hello!</h1>
    <p>Welcome to React</p>
  </div>
);

// 也可以使用React Fragment避免额外的div
const element = (
  <>
    <h1>Hello!</h1>
    <p>Welcome to React</p>
  </>
);
```

### 2. 闭合标签

所有 JSX 标签必须闭合，包括自闭合标签：

```jsx
// 错误写法
<img src="image.jpg">

// 正确写法
<img src="image.jpg" />
```

### 3. 驼峰命名法属性

JSX 使用驼峰命名法（camelCase）来命名 HTML 属性：

```jsx
// HTML中
<div class="container" tabindex="0" onclick="handleClick()"></div>

// JSX中
<div className="container" tabIndex={0} onClick={handleClick}></div>
```

一些常见的 HTML 属性在 JSX 中的对应：

-   `class` → `className`
-   `tabindex` → `tabIndex`
-   `for` → `htmlFor`
-   `onclick` → `onClick`

### 4. JavaScript 表达式

可以通过花括号`{}`在 JSX 中嵌入 JavaScript 表达式：

```jsx
const name = "John";
const element = <h1>Hello, {name}!</h1>;
```

花括号内可以放任何有效的 JavaScript 表达式：

```jsx
function formatName(user) {
    return user.firstName + " " + user.lastName;
}

const user = {
    firstName: "Harper",
    lastName: "Perez",
};

const element = <h1>Hello, {formatName(user)}!</h1>;
```

### 5. JSX 本身也是表达式

你可以在`if`语句和`for`循环中使用 JSX，将它赋值给变量，接受它作为参数，以及从函数中返回它：

```jsx
function getGreeting(user) {
    if (user) {
        return <h1>Hello, {formatName(user)}!</h1>;
    }
    return <h1>Hello, Stranger.</h1>;
}
```

### 6. 指定属性

可以使用引号来指定字符串字面量作为属性：

```jsx
const element = <div tabIndex="0"></div>;
```

也可以使用花括号来在属性中嵌入 JavaScript 表达式：

```jsx
const element = <img src={user.avatarUrl} />;
```

**注意**：在属性中使用表达式时不要在花括号外面加引号。

### 7. 防止 XSS 攻击

React DOM 在渲染所有输入内容之前，默认会进行转义，确保应用不会被注入任何不在代码中明确写出的内容。所有内容在渲染之前都被转换成字符串，这有助于防止 XSS（跨站点脚本）攻击。

## JSX 中的样式与类名

### CSS 类

在 JSX 中，使用`className`而不是`class`来指定 CSS 类：

```jsx
const element = <div className="container">Hello World</div>;
```

### 内联样式

在 JSX 中，内联样式不是以字符串的形式提供，而是以对象的形式，并且使用驼峰命名法：

```jsx
const divStyle = {
    color: "blue",
    backgroundImage: "url(" + imgUrl + ")",
    fontSize: "20px",
};

const element = <div style={divStyle}>Hello World</div>;
```

也可以直接在 JSX 中内联定义样式对象：

```jsx
const element = (
    <div
        style={{
            color: "blue",
            fontSize: "20px",
        }}
    >
        Hello World
    </div>
);
```

## 条件渲染

在 JSX 中有多种方式进行条件渲染：

### 条件运算符（三元表达式）

```jsx
const element = <div>{isLoggedIn ? <UserGreeting /> : <GuestGreeting />}</div>;
```

### 逻辑与运算符（&&）

```jsx
const element = <div>{isLoggedIn && <AdminPanel />}</div>;
```

### 立即执行函数

```jsx
const element = (
    <div>
        {(() => {
            if (condition1) return <Component1 />;
            if (condition2) return <Component2 />;
            return <Component3 />;
        })()}
    </div>
);
```

## 列表渲染

使用 JavaScript 的`map()`方法在 JSX 中渲染列表：

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => (
    <li key={number.toString()}>{number}</li>
));

const element = <ul>{listItems}</ul>;
```

**注意**：`key`是特殊的属性，当创建元素列表时，需要包含 key 属性。keys 帮助 React 识别哪些元素改变了，比如被添加或删除。因此它们应当被赋予数组中的每个元素以赋予元素一个稳定的标识。

## JSX 中的注释

在 JSX 中添加注释需要使用花括号语法：

```jsx
const element = (
    <div>
        {/* 这是一个JSX注释 */}
        <h1>Hello, world!</h1>
    </div>
);
```

## 为什么使用 JSX？

1. **直观**：JSX 让 UI 和逻辑的关系更加清晰
2. **可读性**：比纯 JavaScript 更容易理解组件的结构
3. **强大**：结合了 JavaScript 的全部功能
4. **安全**：内置防止注入攻击的机制
5. **开发效率**：提供了更简洁的语法

## 实践建议

1. **组件分离**：将大型 JSX 结构拆分为小型可复用的组件
2. **语义化标签**：使用 HTML5 语义化标签提高可访问性
3. **合理使用注释**：对复杂逻辑添加注释
4. **避免过度嵌套**：JSX 嵌套层级过深会降低可读性
5. **使用 Prettier 和 ESLint**：保持 JSX 格式一致性

## 后续学习路径

接下来，我们将学习：

1. [[../02-核心概念/01-组件和Props/01-组件和Props概述|组件和Props]] - 了解 React 组件及其属性

## 参考资料

-   [React 官方文档 - JSX 简介](https://reactjs.org/docs/introducing-jsx.html)
-   [React 官方文档 - JSX 深入](https://reactjs.org/docs/jsx-in-depth.html)
