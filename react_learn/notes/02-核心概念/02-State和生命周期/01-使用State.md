# 使用 State

#状态管理 #核心概念

State（状态）是 React 组件中最重要的概念之一，它允许组件存储和管理自身的数据，当状态发生变化时，组件会重新渲染。

## State 的基本概念

State 是组件的内部数据存储，具有以下特点：

-   **私有性**：State 完全受控于当前组件
-   **可变性**：组件可以响应用户操作或其他事件更新状态
-   **异步更新**：State 的更新可能是异步的
-   **触发渲染**：State 变化会导致组件重新渲染

## 类组件中的 State

在类组件中，State 通过`this.state`访问，通过`this.setState()`方法更新。

### 初始化 State

```jsx
class Clock extends React.Component {
    constructor(props) {
        super(props);
        // 初始化state
        this.state = {
            date: new Date(),
        };
    }

    // 组件的其他方法...

    render() {
        return (
            <div>
                <h1>当前时间</h1>
                <h2>{this.state.date.toLocaleTimeString()}</h2>
            </div>
        );
    }
}
```

也可以使用类属性语法（需要 Babel 支持）简化初始化：

```jsx
class Clock extends React.Component {
    // 直接使用类字段初始化state
    state = {
        date: new Date(),
    };

    // 其余部分相同...
}
```

### 更新 State

使用`setState()`方法更新状态：

```jsx
class Counter extends React.Component {
    state = { count: 0 };

    increment = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return (
            <div>
                <p>计数: {this.state.count}</p>
                <button onClick={this.increment}>增加</button>
            </div>
        );
    }
}
```

## 函数组件中的 State

在函数组件中，使用`useState` Hook 来管理状态。

### 使用 useState

```jsx
import React, { useState } from "react";

function Counter() {
    // 声明一个叫"count"的state变量，初始值为0
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
    );
}
```

### 使用多个 State 变量

```jsx
function UserForm() {
    const [name, setName] = useState("");
    const [age, setAge] = useState(18);
    const [email, setEmail] = useState("");

    return (
        <form>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="姓名"
            />
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="年龄"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
            />
        </form>
    );
}
```

## State 更新的重要特性

### 1. 不要直接修改 State

```jsx
// ❌ 错误 - 直接修改state
this.state.count = this.state.count + 1;

// ✅ 正确 - 使用setState()
this.setState({ count: this.state.count + 1 });

// 函数组件中
// ❌ 错误
count = count + 1;

// ✅ 正确
setCount(count + 1);
```

### 2. State 更新可能是异步的

React 可能会批量处理多个`setState()`调用，因此不能依赖当前的 state 值来计算下一个 state：

```jsx
// ❌ 可能无法按预期工作
this.setState({ count: this.state.count + 1 });
this.setState({ count: this.state.count + 1 });
// 可能只增加1，而不是2

// ✅ 使用函数形式的setState确保获取最新state
this.setState((prevState) => ({ count: prevState.count + 1 }));
this.setState((prevState) => ({ count: prevState.count + 1 }));
// 增加2

// 函数组件中
// ❌ 可能存在同样问题
setCount(count + 1);
setCount(count + 1);

// ✅ 使用函数形式
setCount((prevCount) => prevCount + 1);
setCount((prevCount) => prevCount + 1);
```

### 3. State 更新会被合并

在类组件中，`setState()`的对象会浅合并到当前 state：

```jsx
this.state = {
    name: "张三",
    age: 25,
};

// 只更新age，name保持不变
this.setState({ age: 26 });
```

而在函数组件中，`useState`的更新会完全替换旧的 state 值，不会自动合并：

```jsx
const [user, setUser] = useState({
    name: "张三",
    age: 25,
});

// ❌ 错误 - 会完全替换user对象，导致name丢失
setUser({ age: 26 });

// ✅ 正确 - 手动合并
setUser({ ...user, age: 26 });
```

## 向下传递 State

父组件可以将自己的 state 作为 props 传递给子组件：

```jsx
function ParentComponent() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>父组件计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>

            {/* 将state作为props传递给子组件 */}
            <ChildComponent count={count} />
        </div>
    );
}

function ChildComponent({ count }) {
    return <p>子组件接收到的计数: {count}</p>;
}
```

## State 提升

当多个组件需要共享状态时，可以将状态提升到它们最近的共同父组件：

```jsx
function TemperatureCalculator() {
    // 状态提升到共同的父组件
    const [temperature, setTemperature] = useState("");
    const [scale, setScale] = useState("c");

    // 根据摄氏度计算华氏度
    const fahrenheit =
        scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;
    // 根据华氏度计算摄氏度
    const celsius =
        scale === "f" ? tryConvert(temperature, toCelsius) : temperature;

    function handleCelsiusChange(value) {
        setTemperature(value);
        setScale("c");
    }

    function handleFahrenheitChange(value) {
        setTemperature(value);
        setScale("f");
    }

    return (
        <div>
            <TemperatureInput
                scale="c"
                temperature={celsius}
                onTemperatureChange={handleCelsiusChange}
            />
            <TemperatureInput
                scale="f"
                temperature={fahrenheit}
                onTemperatureChange={handleFahrenheitChange}
            />
        </div>
    );
}
```

## 最佳实践

1. **保持状态最小化**：只存储应用所需的最小状态集
2. **确定状态的归属**：找到拥有该状态的最小组件
3. **避免冗余状态**：能从 props 或现有 state 计算的数据不应存为 state
4. **避免深层嵌套状态**：复杂状态考虑使用 Redux 等状态管理库
5. **使用不可变数据模式**：永远不要直接修改 state 对象

## 相关概念

-   [[02-组件生命周期|组件生命周期]] - 组件各个生命周期阶段
-   [[useState]] - React Hook 中管理状态的方法
-   [[状态提升]] - 共享状态的设计模式
-   [[Redux基础]] - 大型应用的状态管理方案
