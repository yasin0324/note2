# useEffect Hook

#hooks #副作用

`useEffect` 是 React 中用于处理副作用(side effects)的 Hook。副作用是指组件渲染之外发生的任何操作，如数据获取、订阅、手动 DOM 操作等。它相当于类组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 的组合。

## 基本用法

```jsx
import React, { useState, useEffect } from "react";

function Example() {
    const [count, setCount] = useState(0);

    // 相当于componentDidMount和componentDidUpdate
    useEffect(() => {
        // 执行副作用操作
        document.title = `你点击了 ${count} 次`;
    });

    return (
        <div>
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>点击我</button>
        </div>
    );
}
```

默认情况下，`useEffect` 在每次渲染后都会执行，包括第一次渲染和每次更新后。

## useEffect 的参数

`useEffect` 接受两个参数：

1. 副作用回调函数
2. 依赖数组（可选）

```jsx
useEffect(
    () => {
        // 副作用代码

        // 可选的清理函数
        return () => {
            // 清理代码
        };
    },
    [
        /* 依赖项数组 */
    ]
);
```

## 依赖数组控制执行时机

依赖数组是 `useEffect` 的第二个参数，它决定了何时重新执行副作用：

### 1. 不传依赖数组：每次渲染都执行

```jsx
useEffect(() => {
    console.log("组件渲染了");
}); // 没有第二个参数
```

### 2. 空依赖数组：只在组件挂载时执行一次

```jsx
useEffect(() => {
    console.log("组件挂载了");

    // 可选：返回清理函数
    return () => {
        console.log("组件将要卸载");
    };
}, []); // 空数组
```

这相当于类组件中的 `componentDidMount` 和 `componentWillUnmount`。

### 3. 有依赖项的数组：当依赖项变化时执行

```jsx
useEffect(() => {
    console.log(`count值变为 ${count}`);

    // 可选：返回清理函数
    return () => {
        console.log(`count从 ${count} 变为新值`);
    };
}, [count]); // count变化时执行
```

这相当于 `componentDidUpdate`，但只在 `count` 变化时触发。

## 清理副作用

有些副作用需要清理，如取消订阅、清除定时器等。为此，`useEffect` 的回调函数可以返回一个清理函数：

```jsx
useEffect(() => {
    // 设置订阅
    const subscription = someAPI.subscribe();

    // 返回清理函数
    return () => {
        // 取消订阅
        subscription.unsubscribe();
    };
}, [someAPI]); // 仅当someAPI变化时重新订阅
```

清理函数会在以下时机执行：

-   组件卸载前
-   下一次执行副作用之前（如果依赖项变化）

## 常见使用场景

### 1. 数据获取

```jsx
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 重置状态
        setUser(null);
        setLoading(true);
        setError(null);

        // 定义获取用户数据的异步函数
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `https://api.example.com/users/${userId}`
                );
                if (!response.ok) {
                    throw new Error("获取用户信息失败");
                }
                const userData = await response.json();
                setUser(userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // 调用异步函数
        fetchUser();

        // 可选的清理函数
        return () => {
            // 如果需要取消请求，可以在这里处理
        };
    }, [userId]); // 仅当userId变化时重新获取

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;
    if (!user) return null;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>邮箱: {user.email}</p>
        </div>
    );
}
```

### 2. 订阅外部数据源

```jsx
function WindowSizeTracker() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        // 处理窗口大小变化的函数
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // 添加事件监听器
        window.addEventListener("resize", handleResize);

        // 清理函数：移除事件监听器
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []); // 空依赖数组意味着只在挂载和卸载时执行

    return (
        <div>
            <p>窗口宽度: {windowSize.width}px</p>
            <p>窗口高度: {windowSize.height}px</p>
        </div>
    );
}
```

### 3. DOM 操作

```jsx
function AutoFocusInput() {
    const inputRef = useRef(null);

    useEffect(() => {
        // 自动聚焦到输入框
        inputRef.current.focus();
    }, []); // 仅在挂载时执行

    return <input ref={inputRef} />;
}
```

### 4. 定时器

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // 设置定时器
        const timer = setInterval(() => {
            setCount((c) => c + 1);
        }, 1000);

        // 清理函数：清除定时器
        return () => {
            clearInterval(timer);
        };
    }, []); // 空依赖数组意味着定时器只设置一次

    return <div>计数: {count}</div>;
}
```

## 依赖项和常见陷阱

### 正确声明依赖项

React 的 ESLint 规则 `exhaustive-deps` 会帮助你找出应该添加到依赖数组中，但被遗漏的依赖项。

```jsx
// ❌ 错误：缺少依赖项
useEffect(() => {
    document.title = `你好, ${name}`;
}, []); // 应该包含name作为依赖项

// ✅ 正确：包含所有依赖项
useEffect(() => {
    document.title = `你好, ${name}`;
}, [name]);
```

### 处理函数依赖

当副作用中使用的函数依赖于组件内部的变量时，可能会导致依赖项问题：

```jsx
function SearchResults({ query }) {
    const [results, setResults] = useState([]);

    // ❌ 问题：fetchData依赖于query，但未在依赖数组中声明
    const fetchData = () => {
        fetch(`https://api.example.com/search?q=${query}`)
            .then((response) => response.json())
            .then((data) => setResults(data));
    };

    useEffect(() => {
        fetchData();
    }, []); // 丢失了query依赖
}
```

解决方法：

1. 将函数放在 useEffect 内部：

```jsx
// ✅ 正确：函数定义在useEffect内部
useEffect(() => {
    const fetchData = () => {
        fetch(`https://api.example.com/search?q=${query}`)
            .then((response) => response.json())
            .then((data) => setResults(data));
    };

    fetchData();
}, [query]); // 正确包含query依赖
```

2. 使用 useCallback 记忆化函数：

```jsx
// ✅ 正确：使用useCallback记忆化函数
const fetchData = useCallback(() => {
    fetch(`https://api.example.com/search?q=${query}`)
        .then((response) => response.json())
        .then((data) => setResults(data));
}, [query]); // 声明query依赖

useEffect(() => {
    fetchData();
}, [fetchData]); // fetchData变化时执行
```

### 处理对象和数组依赖

对象和数组是引用类型，每次渲染都会创建新的引用，这可能会导致 useEffect 不必要地运行：

```jsx
function Component({ id }) {
    // ❌ 问题：config在每次渲染时都是新对象
    const config = { id, version: "1.0" };

    useEffect(() => {
        fetchData(config);
    }, [config]); // config引用每次都变化，即使内容相同
}
```

解决方法：

```jsx
function Component({ id }) {
    // ✅ 正确：分离基本类型依赖
    useEffect(() => {
        const config = { id, version: "1.0" };
        fetchData(config);
    }, [id]); // 只依赖于真正变化的值
}
```

## 使用多个 useEffect 分离关注点

为了使代码更易维护，可以将不同的副作用逻辑分离到多个 useEffect 中：

```jsx
function UserDashboard({ userId }) {
    // 处理用户数据获取
    useEffect(() => {
        // 获取用户数据的逻辑...
    }, [userId]);

    // 处理文档标题更新
    useEffect(() => {
        document.title = `${user.name}的仪表盘`;
    }, [user.name]);

    // 处理日志记录
    useEffect(() => {
        logUserActivity(userId);
        return () => {
            logUserLogout(userId);
        };
    }, [userId]);

    // ...其他组件逻辑
}
```

## useEffect vs. useLayoutEffect

`useEffect` 会在浏览器绘制后异步执行，而 `useLayoutEffect` 会在 DOM 更新后但浏览器绘制前同步执行：

```jsx
// 大多数情况下，使用useEffect
useEffect(() => {
    // 异步执行，不会阻塞浏览器绘制
}, []);

// 当需要在浏览器绘制前更新DOM时，使用useLayoutEffect
useLayoutEffect(() => {
    // 同步执行，会阻塞浏览器绘制
    // 适用于需要测量DOM或防止视觉闪烁的情况
}, []);
```

一般情况下，应首选 `useEffect` 以避免阻塞视觉更新。只有当副作用需要同步测量 DOM 或防止闪烁时，才使用 `useLayoutEffect`。

## 性能优化

### 1. 最小化依赖数组

只包含真正需要的依赖项，避免过度依赖：

```jsx
// ❌ 不必要的依赖项
useEffect(() => {
    logEvent(user.id);
}, [user]); // 整个user对象作为依赖

// ✅ 优化的依赖项
useEffect(() => {
    logEvent(user.id);
}, [user.id]); // 只依赖真正使用的属性
```

### 2. 使用函数式更新避免依赖

当新状态仅基于前一个状态时，可以使用函数式更新减少依赖：

```jsx
// ❌ 依赖count
useEffect(() => {
    const timer = setInterval(() => {
        setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
}, [count]); // 每次count变化都会重新设置定时器

// ✅ 不依赖count
useEffect(() => {
    const timer = setInterval(() => {
        setCount((c) => c + 1); // 使用函数式更新
    }, 1000);
    return () => clearInterval(timer);
}, []); // 定时器只设置一次
```

### 3. 避免频繁执行的副作用

对于可能频繁变化的依赖，考虑使用防抖(debounce)或节流(throttle)：

```jsx
function SearchComponent({ searchTerm }) {
    const [results, setResults] = useState([]);

    // 使用useCallback记忆化debouncedFetch函数
    const debouncedFetch = useCallback(
        debounce((term) => {
            fetch(`/api/search?q=${term}`)
                .then((res) => res.json())
                .then((data) => setResults(data));
        }, 500),
        []
    );

    useEffect(() => {
        if (searchTerm.length > 2) {
            debouncedFetch(searchTerm);
        }
    }, [searchTerm, debouncedFetch]);

    // ...
}
```

## 与类组件生命周期的对比

| 类组件生命周期       | useEffect 对应方式                                     |
| -------------------- | ------------------------------------------------------ |
| componentDidMount    | `useEffect(() => { ... }, [])`                         |
| componentDidUpdate   | `useEffect(() => { ... }, [dependencyA, dependencyB])` |
| componentWillUnmount | `useEffect(() => { return () => { ... } }, [])`        |
| 同时使用所有三个方法 | `useEffect(() => { ... return () => { ... } })`        |

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念和规则
-   [[02-useState|useState]] - 管理组件状态
-   [[06-useCallback|useCallback]] - 记忆化回调函数
-   [[../02-核心概念/02-State和生命周期/02-组件生命周期|组件生命周期]] - 类组件的生命周期方法
