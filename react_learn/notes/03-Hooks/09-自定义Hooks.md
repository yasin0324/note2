# 自定义 Hooks

#hooks #代码复用 #最佳实践

自定义 Hooks 是 React 中一种强大的代码复用机制，允许你将组件逻辑提取到可重用的函数中。它们是建立在 React 内置 Hooks 基础上的函数，能够在不同组件间共享逻辑，同时保持状态的完全隔离。

## 基本概念

自定义 Hook 是一个以 `use` 开头的 JavaScript 函数，可以调用其他的 Hooks。这个命名约定不仅是一种约定俗成的做法，也使 React 能够检查你的 Hook 是否违反了 Hooks 规则。

### 基本规则

1. 自定义 Hook 必须以 `use` 开头（例如：`useFormInput`，`useWindowSize`）
2. 自定义 Hook 可以调用其他 Hooks（如 `useState`，`useEffect`，甚至其他自定义 Hooks）
3. 自定义 Hook 遵循与内置 Hooks 相同的规则（只在顶层调用，只在 React 函数组件或其他 Hooks 中调用）

## 创建自定义 Hook

创建自定义 Hook 的一般步骤：

1. 识别可重用的逻辑
2. 创建一个以 `use` 开头的函数
3. 在函数内部使用 React 内置 Hooks
4. 返回需要在组件中使用的值

### 基本示例：创建简单的表单输入 Hook

```jsx
import { useState } from "react";

// 创建自定义Hook处理表单输入
function useFormInput(initialValue) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e) {
        setValue(e.target.value);
    }

    // 返回值和事件处理函数
    return {
        value,
        onChange: handleChange,
    };
}

// 在组件中使用
function LoginForm() {
    const username = useFormInput("");
    const password = useFormInput("");

    function handleSubmit(e) {
        e.preventDefault();
        console.log("提交的数据:", {
            username: username.value,
            password: password.value,
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>用户名:</label>
                <input {...username} />
            </div>
            <div>
                <label>密码:</label>
                <input type="password" {...password} />
            </div>
            <button type="submit">登录</button>
        </form>
    );
}
```

## 常见的自定义 Hook 模式

### 1. 封装副作用逻辑

```jsx
import { useState, useEffect } from "react";

// 封装数据获取逻辑
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 重置状态
        setLoading(true);
        setData(null);
        setError(null);

        // 定义异步获取函数
        const fetchData = async () => {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP错误! 状态: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message || "获取数据时出错");
            } finally {
                setLoading(false);
            }
        };

        // 调用获取函数
        fetchData();

        // 清理函数（可选）
        return () => {
            // 这里可以添加取消请求的逻辑，如使用AbortController
        };
    }, [url]); // 当URL变化时重新获取

    return { data, loading, error };
}

// 使用这个Hook的组件
function UserProfile({ userId }) {
    const {
        data: user,
        loading,
        error,
    } = useFetch(`https://api.example.com/users/${userId}`);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;
    if (!user) return <div>没有用户数据</div>;

    return (
        <div>
            <h2>{user.name}</h2>
            <p>邮箱: {user.email}</p>
            <p>注册时间: {new Date(user.registeredAt).toLocaleDateString()}</p>
        </div>
    );
}
```

### 2. 抽象浏览器 API

```jsx
import { useState, useEffect } from "react";

// 监听窗口大小变化
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // 添加事件监听器
        window.addEventListener("resize", handleResize);

        // 清理函数
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []); // 空依赖数组意味着这个效果只在挂载和卸载时运行

    return windowSize;
}

// 使用这个Hook的组件
function ResponsiveLayout() {
    const { width, height } = useWindowSize();

    let layout;
    if (width < 768) {
        layout = "mobile";
    } else if (width < 1200) {
        layout = "tablet";
    } else {
        layout = "desktop";
    }

    return (
        <div>
            <p>
                当前窗口尺寸: {width} x {height}
            </p>
            <p>当前布局模式: {layout}</p>
        </div>
    );
}
```

### 3. 管理共享状态

```jsx
import { useState, useCallback } from "react";

// 创建计数器Hook
function useCounter(initialValue = 0, step = 1) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount((c) => c + step);
    }, [step]);

    const decrement = useCallback(() => {
        setCount((c) => c - step);
    }, [step]);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    return {
        count,
        increment,
        decrement,
        reset,
    };
}

// 共享计数器Hook状态的多个组件
function CounterDisplay() {
    const { count, increment, decrement, reset } = useCounter(0, 1);

    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={increment}>增加</button>
            <button onClick={decrement}>减少</button>
            <button onClick={reset}>重置</button>

            <OtherComponent count={count} />
        </div>
    );
}

function OtherComponent({ count }) {
    return (
        <div>
            <p>在其他组件中显示相同的计数: {count}</p>
        </div>
    );
}
```

### 4. 跟踪前一个值

```jsx
import { useRef, useEffect } from "react";

// 跟踪值的前一个状态的Hook
function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]); // 值变化后更新ref

    return ref.current; // 返回之前保存的值
}

// 使用这个Hook的组件
function StockPriceTracker({ price }) {
    const previousPrice = usePrevious(price);

    // 计算价格变化
    const change = previousPrice !== undefined ? price - previousPrice : 0;

    // 确定显示颜色
    const changeColor = change > 0 ? "green" : change < 0 ? "red" : "black";

    return (
        <div>
            <h2>股票价格: ${price.toFixed(2)}</h2>
            <p style={{ color: changeColor }}>
                {change > 0 ? "↑" : change < 0 ? "↓" : "－"}
                {Math.abs(change).toFixed(2)}(
                {previousPrice
                    ? ((change / previousPrice) * 100).toFixed(2)
                    : 0}
                %)
            </p>
        </div>
    );
}
```

### 5. 本地存储集成

```jsx
import { useState, useEffect } from "react";

// 在localStorage中持久化状态的Hook
function useLocalStorage(key, initialValue) {
    // 读取初始值
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // 尝试从localStorage获取值
            const item = window.localStorage.getItem(key);
            // 解析存储的JSON或返回初始值
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`从localStorage读取${key}时出错:`, error);
            return initialValue;
        }
    });

    // 更新存储值的函数
    const setValue = (value) => {
        try {
            // 允许值是函数，就像setState一样
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // 保存到state
            setStoredValue(valueToStore);

            // 保存到localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`向localStorage写入${key}时出错:`, error);
        }
    };

    // 监听其他标签页的storage事件
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key && event.newValue) {
                setStoredValue(JSON.parse(event.newValue));
            }
        };

        // 添加事件监听器
        window.addEventListener("storage", handleStorageChange);

        // 清理函数
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}

// 使用这个Hook的组件
function SettingsForm() {
    const [settings, setSettings] = useLocalStorage("user-settings", {
        theme: "light",
        fontSize: "medium",
        notifications: true,
    });

    const handleThemeChange = (e) => {
        setSettings({
            ...settings,
            theme: e.target.value,
        });
    };

    const handleFontSizeChange = (e) => {
        setSettings({
            ...settings,
            fontSize: e.target.value,
        });
    };

    const handleNotificationsChange = (e) => {
        setSettings({
            ...settings,
            notifications: e.target.checked,
        });
    };

    return (
        <form>
            <h2>用户设置</h2>

            <div>
                <label>主题:</label>
                <select value={settings.theme} onChange={handleThemeChange}>
                    <option value="light">浅色</option>
                    <option value="dark">深色</option>
                    <option value="system">跟随系统</option>
                </select>
            </div>

            <div>
                <label>字体大小:</label>
                <select
                    value={settings.fontSize}
                    onChange={handleFontSizeChange}
                >
                    <option value="small">小</option>
                    <option value="medium">中</option>
                    <option value="large">大</option>
                </select>
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={handleNotificationsChange}
                    />
                    启用通知
                </label>
            </div>
        </form>
    );
}
```

## 在自定义 Hook 中组合 Hooks

自定义 Hook 的强大之处在于可以组合使用多个基础 Hook 或其他自定义 Hook：

```jsx
import { useState, useEffect, useCallback } from "react";

// 基础的数据获取Hook
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json);
            setError(null);
        } catch (err) {
            setError(err.toString());
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// 使用useFetch构建更专业的Hook
function useUser(userId) {
    const {
        data: user,
        loading,
        error,
        refetch,
    } = useFetch(`https://api.example.com/users/${userId}`);

    const isAdmin = user ? user.role === "admin" : false;

    return {
        user,
        loading,
        error,
        isAdmin,
        refetchUser: refetch,
    };
}

// 在组件中使用组合的Hook
function UserAdmin({ userId }) {
    const { user, loading, error, isAdmin, refetchUser } = useUser(userId);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;
    if (!user) return <div>没有用户数据</div>;

    return (
        <div>
            <h2>{user.name}</h2>
            <p>角色: {user.role}</p>
            {isAdmin && (
                <div>
                    <p>管理员面板</p>
                    {/* 管理员特有的UI */}
                </div>
            )}
            <button onClick={refetchUser}>刷新用户数据</button>
        </div>
    );
}
```

## 测试自定义 Hook

自定义 Hook 的测试通常需要创建一个测试组件或使用特殊的工具：

```jsx
// hooks/useCounter.js
import { useState, useCallback } from "react";

export function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => setCount((c) => c + 1), []);
    const decrement = useCallback(() => setCount((c) => c - 1), []);
    const reset = useCallback(() => setCount(initialValue), [initialValue]);

    return { count, increment, decrement, reset };
}

// hooks/useCounter.test.js
import { renderHook, act } from "@testing-library/react-hooks";
import { useCounter } from "./useCounter";

test("应该使用默认初始值0", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
});

test("应该使用指定的初始值", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
});

test("应该递增计数", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
        result.current.increment();
    });

    expect(result.current.count).toBe(1);
});

test("应该递减计数", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
        result.current.decrement();
    });

    expect(result.current.count).toBe(4);
});

test("应该重置计数", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
        result.current.increment();
        result.current.reset();
    });

    expect(result.current.count).toBe(5);
});
```

## 设计自定义 Hook 的最佳实践

1. **遵循单一职责原则**：每个自定义 Hook 应该只做一件事，并做好这件事

```jsx
// ❌ 做太多事情的Hook
function useDataAndUIState(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("info");
    const [modalOpen, setModalOpen] = useState(false);

    // 数据获取逻辑...

    return { data, loading, tab, setTab, modalOpen, setModalOpen };
}

// ✅ 单一职责的Hooks
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 数据获取逻辑...

    return { data, loading };
}

function useTabs(initialTab) {
    const [tab, setTab] = useState(initialTab);
    return { tab, setTab };
}

function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
}
```

2. **命名清晰明了**：Hook 名称应该清晰地表明其用途

```jsx
// ❌ 不清晰的名称
function useStuff() {
    /* ... */
}

// ✅ 清晰的名称
function useWindowSize() {
    /* ... */
}
function useUserAuthentication() {
    /* ... */
}
function useDarkMode() {
    /* ... */
}
```

3. **提供有意义的返回值**：返回值应该具有描述性，通常使用对象返回多个值

```jsx
// ❌ 返回数组可能导致混淆
function useFormField(initialValue) {
    const [value, setValue] = useState(initialValue);
    const handleChange = (e) => setValue(e.target.value);

    return [value, handleChange];
}

// ✅ 返回对象提供自描述性
function useFormField(initialValue) {
    const [value, setValue] = useState(initialValue);
    const handleChange = (e) => setValue(e.target.value);

    return { value, onChange: handleChange };
}
```

4. **处理错误和加载状态**：提供全面的状态管理

```jsx
function useData(url) {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setState({ data: null, loading: true, error: null });

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (isMounted) {
                    setState({ data, loading: false, error: null });
                }
            } catch (error) {
                if (isMounted) {
                    setState({ data: null, loading: false, error });
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return state;
}
```

5. **提供灵活的 API**：允许用户自定义 Hook 的行为

```jsx
function useFetch(url, options = {}) {
    const {
        initialData = null,
        manual = false,
        fetchOptions = {},
        onSuccess = () => {},
        onError = () => {},
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!manual);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, fetchOptions);
            const result = await response.json();
            setData(result);
            onSuccess(result);
        } catch (err) {
            setError(err);
            onError(err);
        } finally {
            setLoading(false);
        }
    }, [url, fetchOptions, onSuccess, onError]);

    useEffect(() => {
        if (!manual) {
            fetchData();
        }
    }, [manual, fetchData]);

    return { data, loading, error, refetch: fetchData };
}
```

## TypeScript 中的自定义 Hook

在 TypeScript 中，可以为自定义 Hook 提供类型定义，增强类型安全性和开发体验：

```tsx
import { useState, useEffect } from "react";

// 定义类型接口
interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

// 泛型自定义Hook
function useFetch<T>(url: string) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setState({ data: null, loading: true, error: null });

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (isMounted) {
                    setState({ data, loading: false, error: null });
                }
            } catch (error) {
                if (isMounted) {
                    setState({
                        data: null,
                        loading: false,
                        error:
                            error instanceof Error
                                ? error
                                : new Error(String(error)),
                    });
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return state;
}

// 使用自定义Hook的组件
interface User {
    id: number;
    name: string;
    email: string;
}

function UserProfile({ userId }: { userId: number }) {
    const { data, loading, error } = useFetch<User>(
        `https://api.example.com/users/${userId}`
    );

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error.message}</div>;
    if (!data) return <div>没有用户数据</div>;

    return (
        <div>
            <h2>{data.name}</h2>
            <p>邮箱: {data.email}</p>
        </div>
    );
}
```

## 自定义 Hook 的优势

1. **逻辑重用**：在多个组件之间共享逻辑而不重复代码
2. **关注点分离**：将组件 UI 和业务逻辑分离
3. **可测试性**：使逻辑部分更易于单元测试
4. **可组合性**：可以组合使用多个 Hook 创建更复杂的行为
5. **状态隔离**：每个使用自定义 Hook 的组件都有自己独立的状态

## 常见的自定义 Hook 库

许多开源库提供了常用的自定义 Hook：

1. **react-use**：提供了大量的通用 Hook
2. **react-hook-form**：表单处理 Hook
3. **use-http/react-fetch-hook**：数据获取 Hook
4. **react-query**：用于管理和缓存服务器状态
5. **swr**：用于数据获取的 Hook，支持 stale-while-revalidate 缓存策略

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念和规则
-   [[02-useState|useState]] - 在自定义 Hook 中管理状态
-   [[03-useEffect|useEffect]] - 在自定义 Hook 中处理副作用
-   [[08-useRef|useRef]] - 在自定义 Hook 中使用引用
-   [[06-useCallback|useCallback]] - 优化自定义 Hook 中的回调函数
