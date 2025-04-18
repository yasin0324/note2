# JSX 相关问题

## 问题 1: JSX 中为什么要使用 className 而不是 class？

**问题描述**：
在 HTML 中我们使用`class`属性来添加 CSS 类，但在 JSX 中却需要使用`className`。这是为什么？

**解答**：
在 JSX 中使用`className`而不是`class`的原因是：

1. **避免与 JavaScript 关键字冲突**：`class`是 JavaScript 中的保留关键字，用于定义类（ES6 语法）。为了避免冲突，React 选择使用`className`来定义 CSS 类。

2. **与 DOM 属性保持一致**：React 的属性名称遵循 DOM 属性的命名约定，而在 DOM API 中，元素的类名属性是`className`而不是`class`（如：`element.className = 'my-class'`）。

示例：

```jsx
// 正确的JSX写法
<div className="container">Hello World</div>

// 错误的JSX写法
<div class="container">Hello World</div>
```

## 问题 2: 如何在 JSX 中添加注释？

**问题描述**：
我尝试在 JSX 中添加 HTML 风格的注释`<!-- 注释 -->`，但编译时报错。JSX 中应该如何正确添加注释？

**解答**：
在 JSX 中，注释需要写在花括号`{}`内，并使用 JavaScript 的多行注释语法：

```jsx
const element = (
    <div>
        {/* 这是JSX中的注释 */}
        <h1>Hello, world!</h1>
        {/* 
      也可以是多行注释
      第二行
    */}
    </div>
);
```

注意事项：

-   不能使用 HTML 风格的注释`<!-- -->`
-   单行注释`// 注释`在某些情况下也可以使用，但可能导致格式问题，推荐使用`{/* */}`格式

## 问题 3: JSX 中的花括号{}是什么作用？

**问题描述**：
JSX 中经常看到花括号`{}`的使用，它们的具体作用是什么？

**解答**：
在 JSX 中，花括号`{}`用于在标记语言中嵌入 JavaScript 表达式。通过花括号，你可以：

1. **插入变量值**：

```jsx
const name = "John";
const element = <h1>Hello, {name}</h1>;
```

2. **执行 JavaScript 表达式**：

```jsx
const element = <h1>2 + 2 = {2 + 2}</h1>; // 显示 "2 + 2 = 4"
```

3. **在属性中使用动态值**：

```jsx
const imgUrl = "https://example.com/image.jpg";
const element = <img src={imgUrl} />;
```

4. **条件渲染**：

```jsx
const element = (
    <div>
        {isLoggedIn && <UserGreeting />}
        {!isLoggedIn && <GuestGreeting />}
    </div>
);
```

5. **渲染列表**：

```jsx
const items = ["Apple", "Banana", "Orange"];
const listItems = (
    <ul>
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ul>
);
```

总之，花括号是 JSX 中连接 JavaScript 和标记语言的桥梁。
