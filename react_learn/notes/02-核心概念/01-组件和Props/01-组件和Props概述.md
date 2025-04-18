# 组件和 Props

#组件 #基础 #React 核心概念

React 组件是构建用户界面的基本单位，它们允许我们将 UI 拆分为独立、可复用的部分，并对每个部分进行独立思考。本笔记将详细介绍 React 组件及其属性（Props）。

## 什么是组件？

组件从概念上看就像是函数，它接受任意的输入（称为"props"），并返回描述页面上应该显示内容的 React 元素。

组件有两种类型：**函数组件**和**类组件**。

### 函数组件

函数组件是最简单的定义组件的方式：

```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}
```

这个函数是一个有效的 React 组件，因为它接收一个"props"（代表属性）对象参数，并返回一个 React 元素。我们称这种组件为"函数组件"，因为它本质上是一个 JavaScript 函数。

### 类组件

也可以使用 ES6 的 class 来定义组件：

```jsx
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

从 React 的角度看，上述两个组件是等效的。

## 组件的渲染

之前，我们只遇到过表示 DOM 标签的 React 元素：

```jsx
const element = <div />;
```

但是，React 元素也可以表示用户自定义的组件：

```jsx
const element = <Welcome name="Sara" />;
```

当 React 看到表示用户自定义组件的元素时，它会将 JSX 属性和子组件作为单个对象（"props"）传递给该组件。

示例：渲染"Welcome"组件：

```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(element, document.getElementById("root"));
```

在这个示例中：

1. 我们调用`ReactDOM.render()`渲染`<Welcome name="Sara" />`元素。
2. React 调用`Welcome`组件，并将`{name: 'Sara'}`作为 props 传入。
3. `Welcome`组件返回`<h1>Hello, Sara</h1>`元素作为结果。
4. React DOM 将 DOM 高效地更新为`<h1>Hello, Sara</h1>`。

**注意**：组件名称必须以大写字母开头。React 将小写字母开头的组件视为 DOM 标签。例如，`<div />`表示 HTML 的 div 标签，但`<Welcome />`表示一个组件。

## 组合组件

组件可以在其输出中引用其他组件，这使我们可以对任何级别的细节使用相同的组件抽象。按钮、表单、对话框、甚至整个页面在 React 应用中都被表示为组件。

例如，我们可以创建一个多次渲染`Welcome`组件的`App`组件：

```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

function App() {
    return (
        <div>
            <Welcome name="Sara" />
            <Welcome name="Cahal" />
            <Welcome name="Edite" />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

通常，新的 React 应用程序在最顶层有一个`App`组件。但如果要将 React 集成到现有应用程序中，可能需要使用`Button`这样的小组件，并自下而上地逐步将这类组件应用到视图层的最顶层。

## 提取组件

不要害怕将组件分解成更小的组件。

例如，考虑这个`Comment`组件：

```jsx
function Comment(props) {
    return (
        <div className="Comment">
            <div className="UserInfo">
                <img
                    className="Avatar"
                    src={props.author.avatarUrl}
                    alt={props.author.name}
                />
                <div className="UserInfo-name">{props.author.name}</div>
            </div>
            <div className="Comment-text">{props.text}</div>
            <div className="Comment-date">{formatDate(props.date)}</div>
        </div>
    );
}
```

这个组件接受`author`（对象）、`text`（字符串）和`date`（日期）作为 props，描述了社交媒体网站上的一条评论。

这个组件难以更改，因为它嵌套了太多内容，且难以复用其中的部分。让我们从中提取几个组件。

首先，提取`Avatar`组件：

```jsx
function Avatar(props) {
    return (
        <img
            className="Avatar"
            src={props.user.avatarUrl}
            alt={props.user.name}
        />
    );
}
```

接下来，提取`UserInfo`组件，它在用户名旁边渲染`Avatar`：

```jsx
function UserInfo(props) {
    return (
        <div className="UserInfo">
            <Avatar user={props.user} />
            <div className="UserInfo-name">{props.user.name}</div>
        </div>
    );
}
```

现在我们可以简化`Comment`组件：

```jsx
function Comment(props) {
    return (
        <div className="Comment">
            <UserInfo user={props.author} />
            <div className="Comment-text">{props.text}</div>
            <div className="Comment-date">{formatDate(props.date)}</div>
        </div>
    );
}
```

提取组件一开始可能看起来是繁琐的工作，但在大型应用中，开发可复用的组件集合是非常值得的。一个好的经验法则是：如果 UI 的一部分被多次使用（`Button`、`Panel`、`Avatar`），或者足够复杂（`App`、`FeedStory`、`Comment`），那么它就是一个可复用组件的候选项。

## Props 的特性

### 1. Props 是只读的

无论你将组件声明为函数或是类，它都不能修改自己的 props。考虑这个计算总和的函数：

```js
function sum(a, b) {
    return a + b;
}
```

这样的函数被称为"纯函数"，因为它不会尝试更改输入，且对于相同的输入总是返回相同的结果。

相反，这个函数不是纯函数，因为它更改了自己的输入：

```js
function withdraw(account, amount) {
    account.total -= amount;
}
```

**React 要求所有组件的行为像纯函数一样对待它们的 props。**

当然，应用程序的 UI 是动态的，会随时间变化。在后面的章节中，我们将介绍一个新的概念"state"。State 允许 React 组件随用户操作、网络响应或任何其他东西而改变其输出，且不违反此规则。

### 2. Props 可以传递任何 JavaScript 值

你可以将任何 JavaScript 值作为 props 传递，包括：

-   数字：`<Counter count={42} />`
-   字符串：`<Greeting name="John" />`
-   布尔值：`<Toggle isOn={true} />`
-   数组：`<List items={['apple', 'banana', 'cherry']} />`
-   对象：`<User info={{ name: 'John', age: 30 }} />`
-   函数：`<Button onClick={handleClick} />`
-   JSX：`<Container content={<p>Hello</p>} />`

### 3. Props 可以设置默认值

对于函数组件，你可以使用默认参数语法：

```jsx
function Welcome({ name = "Guest" }) {
    return <h1>Hello, {name}</h1>;
}
```

对于类组件，你可以使用静态属性 defaultProps：

```jsx
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

Welcome.defaultProps = {
    name: "Guest",
};
```

## 类型检查

随着应用程序的增长，可以通过类型检查捕获大量错误。对于较大的项目，建议使用 TypeScript 或 Flow 进行静态类型检查。

但即使不使用这些工具，React 也内置了一些类型检查功能。要在组件的 props 上运行类型检查，可以指定特殊的`propTypes`属性：

```jsx
import PropTypes from "prop-types";

function Greeting({ name }) {
    return <h1>Hello, {name}</h1>;
}

Greeting.propTypes = {
    name: PropTypes.string.isRequired,
};
```

在这个例子中，我们使用 PropTypes 验证`name`prop 是否为必需的字符串。当提供无效值时，会在控制台中显示警告。出于性能原因，`propTypes`仅在开发模式下检查。

## 组件设计原则

设计 React 组件时有几个重要原则：

### 1. 单一职责原则

每个组件应该只做一件事。如果组件变得复杂，应该将其分解为更小的组件。

### 2. 组件接口明确

props 定义了组件的"公共 API"。它应该稳定且直观，并且仅包含组件所需的内容。

### 3. 组合优于继承

React 推荐使用组合而不是继承来复用组件之间的代码。如果组件需要定制，可以考虑接受额外的 props 或使用"插槽"模式（children prop）。

## 实用技巧

### 1. 通过扩展运算符传递所有 props

如果你已经有了 props 对象，并想在 JSX 中传递它，可以使用展开运算符`...`：

```jsx
function App() {
    const userProps = { firstName: "John", lastName: "Doe" };
    return <Greeting {...userProps} />;
}
```

### 2. 使用 children prop

任何嵌套在组件开始和结束标签之间的 JSX 内容都将作为`children`prop 传递给该组件：

```jsx
function Container({ children }) {
    return <div className="container">{children}</div>;
}

// 使用方式
<Container>
    <h1>My Page</h1>
    <p>This is my content</p>
</Container>;
```

### 3. 条件渲染组件

可以使用条件语句或三元运算符来有条件地渲染组件：

```jsx
function UserGreeting({ user }) {
    return user ? (
        <h1>Welcome back, {user.name}!</h1>
    ) : (
        <h1>Welcome, Guest!</h1>
    );
}
```

## 后续学习路径

接下来，我们将学习：

1. [[../02-函数组件|函数组件]] - 深入学习 React 的函数组件
2. [[../03-类组件|类组件]] - 深入学习 React 的类组件
3. [[../../02-State和生命周期/01-State和生命周期概述|State和生命周期]] - 了解组件的状态和生命周期

## 参考资料

-   [React 官方文档 - 组件和 Props](https://reactjs.org/docs/components-and-props.html)
-   [React 官方文档 - 组合 vs 继承](https://reactjs.org/docs/composition-vs-inheritance.html)
