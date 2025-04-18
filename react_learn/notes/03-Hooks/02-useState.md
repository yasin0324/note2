# useState Hook

#hooks #状态管理

`useState` 是 React 中最基本的 Hook，它允许在函数组件中添加状态(state)。它是替代类组件中 `this.state` 和 `this.setState()` 的解决方案。

## 基本用法

```jsx
import React, { useState } from "react";

function Counter() {
    // 声明一个名为"count"的状态变量，初始值为0
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>点击我</button>
        </div>
    );
}
```

`useState` 的调用做了两件事：

1. 创建一个"状态变量"，初始值为传入的参数（上例中为 0）
2. 创建一个更新这个状态的函数

## useState 的参数和返回值

### 参数

`useState` 接受一个参数作为初始状态。这个初始状态只在组件的初次渲染中起作用。

```jsx
// 直接传入初始值
const [count, setCount] = useState(0);

// 也可以使用函数计算初始状态（惰性初始化）
const [count, setCount] = useState(() => {
    // 这个函数只在组件初次渲染时执行一次
    const initialCount = someExpensiveComputation();
    return initialCount;
});
```

当初始状态需要通过复杂计算获取时，使用函数形式可以避免每次渲染都进行计算。

### 返回值

`useState` 返回一个有两个元素的数组：

1. 当前状态值
2. 更新状态的函数

我们通常使用数组解构来获取这两个值：

```jsx
const [state, setState] = useState(initialState);
```

## 更新状态

### 基本更新

```jsx
const [count, setCount] = useState(0);

// 直接设置新值
setCount(5); // count变为5
```

### 基于先前的状态更新

当新的状态依赖于之前的状态时，应该使用函数形式的更新：

```jsx
// ❌ 可能出现问题的方式
setCount(count + 1);

// ✅ 安全的方式 - 函数形式
setCount((prevCount) => prevCount + 1);
```

函数形式总是能获取到最新的状态值，这对于在同一事件处理函数中多次调用状态更新尤其重要。

### 多个状态更新的合并

React 可能会批量处理多个状态更新，这是为了性能优化。

```jsx
// 这两行代码可能会被批处理为一次更新
setCount((prevCount) => prevCount + 1);
setFlag((prevFlag) => !prevFlag);
```

在 React 18 之前，只有在 React 事件处理程序内部才会自动批处理更新。在 React 18 及以后，所有更新都会自动批处理。

## 使用对象或数组作为状态

当使用对象或数组作为状态时，重要的是在更新时创建新对象，而不是修改原对象。

### 对象状态

```jsx
const [user, setUser] = useState({ name: "张三", age: 25 });

// ❌ 错误方式: 直接修改状态对象
// user.age = 26;
// setUser(user);

// ✅ 正确方式: 使用展开运算符创建新对象
setUser({ ...user, age: 26 });
```

### 数组状态

```jsx
const [items, setItems] = useState([1, 2, 3]);

// 添加项目
setItems([...items, 4]);

// 删除项目
setItems(items.filter((item) => item !== 2));

// 更新特定项目
setItems(items.map((item) => (item === 2 ? 20 : item)));
```

## 使用多个 useState

你可以在一个组件中多次使用 `useState`：

```jsx
function UserForm() {
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
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

## useState vs useReducer

对于简单状态，`useState` 是理想的选择。但当状态逻辑变得复杂，或者状态更新依赖于多个其他状态时，考虑使用 [[05-useReducer|useReducer]]：

```jsx
// 使用useState管理复杂状态
const [state, setState] = useState({
    count: 0,
    step: 1,
    history: [],
});

// 更新复杂状态
setState((prevState) => ({
    ...prevState,
    count: prevState.count + prevState.step,
    history: [...prevState.history, prevState.count],
}));

// 使用useReducer可能更适合这类场景
```

## 函数式更新与性能优化

使用函数式更新可以避免在依赖项中包含状态，这对于与 `useCallback` 和 `useMemo` 一起使用时特别有用：

```jsx
// ❌ 每次count变化，increment函数都会重新创建
const increment = useCallback(() => {
    setCount(count + 1);
}, [count]); // 依赖于count

// ✅ 使用函数式更新，移除对count的依赖
const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
}, []); // 没有依赖项
```

## useState 与 useEffect 的结合

`useState` 常与 `useEffect` 结合使用，用于处理副作用：

```jsx
function Example() {
    const [count, setCount] = useState(0);

    // 当count变化时执行side effect
    useEffect(() => {
        document.title = `你点击了 ${count} 次`;
    }, [count]);

    return (
        <div>
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>点击我</button>
        </div>
    );
}
```

## 常见陷阱和解决方案

### 1. 状态更新是异步的

```jsx
setCount(count + 1);
console.log(count); // 仍然是旧值!

// 要访问更新后的状态，使用useEffect
useEffect(() => {
    console.log("更新后的count:", count);
}, [count]);
```

### 2. 直接修改状态对象

始终使用新对象替换状态，而不是修改现有状态对象：

```jsx
// ❌ 不要这样做
const [user, setUser] = useState({ name: "张三", score: 0 });
user.score = 100; // 直接修改不会触发重新渲染
setUser(user);

// ✅ 而应该这样做
setUser({ ...user, score: 100 });
```

### 3. 初始状态只使用一次

```jsx
function Counter({ initialCount }) {
    const [count, setCount] = useState(initialCount);

    // initialCount的后续变化不会影响count
    // 要响应prop变化，需要额外逻辑
    useEffect(() => {
        setCount(initialCount);
    }, [initialCount]);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## 最佳实践

1. **选择适当的状态结构**：根据数据之间的关联程度，决定是使用单个对象状态还是多个独立状态。

2. **遵循单一职责原则**：每个状态变量应该代表一个单一的、独立的关注点。

3. **避免冗余状态**：可以从 props 或其他状态计算得出的数据不应该存为状态。

4. **使用函数式更新**：特别是当更新基于先前的状态，或需要进行性能优化时。

5. **惰性初始化**：当初始状态的计算开销较大时，使用函数形式提供初始状态。

## 与类组件状态的对比

| 类组件                       | 函数组件 + useState       |
| ---------------------------- | ------------------------- |
| 状态必须是对象               | 状态可以是任意类型        |
| `this.setState()` 会合并对象 | `setState()` 完全替换状态 |
| 只能有一个状态对象           | 可以有多个状态变量        |
| 状态更新可能是异步的         | 状态更新是异步的          |

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念和规则
-   [[05-useReducer|useReducer]] - 处理复杂状态逻辑
-   [[03-useEffect|useEffect]] - 处理副作用
-   [[../02-核心概念/02-State和生命周期/01-使用State|使用State]] - 类组件中的状态管理
