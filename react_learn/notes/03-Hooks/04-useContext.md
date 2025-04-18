# useContext Hook

#hooks #context #全局状态

`useContext` 是 React 的一个内置 Hook，用于在组件树中方便地共享值，无需通过 props 显式地逐层传递。它与 React 的 Context API 配合使用，提供了一种在组件树中共享状态的解决方案。

## Context API 简介

在了解`useContext`前，我们需要先理解 React 的 Context API：

Context 提供了一种在组件树中共享值的方式，无需通过 props 显式地逐层传递。它设计用于共享被视为"全局"的数据，例如当前认证的用户、主题或首选语言。

Context API 由三部分组成：

1. `React.createContext` - 创建一个 Context 对象
2. `Context.Provider` - 提供值的组件
3. `Context.Consumer` (或 `useContext`) - 消费值的组件

## useContext 基本用法

`useContext` 是消费 Context 值的 Hook 版本，替代了旧的 `Context.Consumer` 组件写法，使代码更简洁。

**步骤 1：创建 Context**

```jsx
// ThemeContext.js
import { createContext } from "react";

// 创建Context并设置默认值
const ThemeContext = createContext("light");

export default ThemeContext;
```

**步骤 2：提供 Context 值**

```jsx
// App.js
import React, { useState } from "react";
import ThemeContext from "./ThemeContext";
import ThemedButton from "./ThemedButton";

function App() {
    const [theme, setTheme] = useState("light");

    return (
        <ThemeContext.Provider value={theme}>
            <div>
                <button
                    onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                    }
                >
                    切换主题
                </button>
                <ThemedButton />
            </div>
        </ThemeContext.Provider>
    );
}
```

**步骤 3：使用 useContext 消费 Context 值**

```jsx
// ThemedButton.js
import React, { useContext } from "react";
import ThemeContext from "./ThemeContext";

function ThemedButton() {
    // 使用useContext读取当前Context值
    const theme = useContext(ThemeContext);

    return (
        <button
            style={{
                background: theme === "dark" ? "#333" : "#EEE",
                color: theme === "dark" ? "#FFF" : "#000",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                margin: "10px",
            }}
        >
            我是一个{theme === "dark" ? "深色" : "浅色"}主题按钮
        </button>
    );
}

export default ThemedButton;
```

## 与旧的 Context.Consumer 对比

在 Hooks 出现之前，我们使用 Context.Consumer 组件来消费 Context 值：

```jsx
// 旧的方式：使用Context.Consumer
function ThemedButton() {
    return (
        <ThemeContext.Consumer>
            {(theme) => (
                <button
                    style={{
                        background: theme === "dark" ? "#333" : "#EEE",
                        color: theme === "dark" ? "#FFF" : "#000",
                    }}
                >
                    我是一个{theme === "dark" ? "深色" : "浅色"}主题按钮
                </button>
            )}
        </ThemeContext.Consumer>
    );
}
```

使用`useContext`可以让代码更简洁，避免了回调函数嵌套，尤其是在需要消费多个 Context 时：

```jsx
// 使用useContext消费多个Context
function ProfilePage() {
    const theme = useContext(ThemeContext);
    const user = useContext(UserContext);
    const language = useContext(LanguageContext);

    return (
        <div className={`profile-page ${theme}`}>
            <h1>{user.name}</h1>
            <p>{language === "zh" ? "欢迎回来" : "Welcome back"}</p>
        </div>
    );
}
```

## useContext 工作原理

当一个组件使用 `useContext(MyContext)` 时：

1. React 会查找组件树中最近的 `MyContext.Provider`
2. 使用该 Provider 提供的 `value` 属性作为当前的 context 值
3. 当 Provider 的 value 值发生变化时，使用该 context 的组件会重新渲染

需要注意的是，`useContext(MyContext)` 只让你读取 context 并订阅其变化。你仍然需要在上层组件中使用 `<MyContext.Provider>` 来为下层组件提供 context。

## 复杂状态管理示例

下面是一个更完整的示例，展示如何使用 useContext 和 useReducer 结合创建一个简单的全局状态管理解决方案：

**步骤 1：创建 Store 上下文**

```jsx
// StoreContext.js
import { createContext } from "react";

const StoreContext = createContext();

export default StoreContext;
```

**步骤 2：创建 Reducer 和初始状态**

```jsx
// storeReducer.js
export const initialState = {
    user: null,
    theme: "light",
    language: "zh",
    cart: [],
};

export function storeReducer(state, action) {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload };
        case "TOGGLE_THEME":
            return {
                ...state,
                theme: state.theme === "light" ? "dark" : "light",
            };
        case "SET_LANGUAGE":
            return { ...state, language: action.payload };
        case "ADD_TO_CART":
            return { ...state, cart: [...state.cart, action.payload] };
        case "REMOVE_FROM_CART":
            return {
                ...state,
                cart: state.cart.filter(
                    (item) => item.id !== action.payload.id
                ),
            };
        default:
            return state;
    }
}
```

**步骤 3：创建 Store Provider 组件**

```jsx
// StoreProvider.js
import React, { useReducer } from "react";
import StoreContext from "./StoreContext";
import { storeReducer, initialState } from "./storeReducer";

function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(storeReducer, initialState);

    // 将state和dispatch打包在一起提供给消费组件
    const value = { state, dispatch };

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
}

export default StoreProvider;
```

**步骤 4：创建自定义 Hook 简化 Context 使用**

```jsx
// useStore.js
import { useContext } from "react";
import StoreContext from "./StoreContext";

// 自定义Hook简化Context的使用
function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore必须在StoreProvider内使用");
    }
    return context;
}

export default useStore;
```

**步骤 5：包装应用程序**

```jsx
// App.js
import React from "react";
import StoreProvider from "./StoreProvider";
import MainContent from "./MainContent";

function App() {
    return (
        <StoreProvider>
            <MainContent />
        </StoreProvider>
    );
}

export default App;
```

**步骤 6：在组件中使用全局状态**

```jsx
// Profile.js
import React from "react";
import useStore from "./useStore";

function Profile() {
    const { state, dispatch } = useStore();
    const { user, theme } = state;

    const login = () => {
        dispatch({
            type: "SET_USER",
            payload: { id: 1, name: "张三", email: "zhangsan@example.com" },
        });
    };

    const logout = () => {
        dispatch({ type: "SET_USER", payload: null });
    };

    return (
        <div className={`profile ${theme}`}>
            {user ? (
                <div>
                    <h2>欢迎, {user.name}</h2>
                    <p>邮箱: {user.email}</p>
                    <button onClick={logout}>退出登录</button>
                </div>
            ) : (
                <button onClick={login}>登录</button>
            )}

            <button onClick={() => dispatch({ type: "TOGGLE_THEME" })}>
                切换到{theme === "light" ? "深色" : "浅色"}主题
            </button>
        </div>
    );
}

export default Profile;
```

## 性能考虑

### Context Value 的优化

当 Provider 的 value 变化时，所有消费该 context 的组件都会重新渲染。因此，最好避免在 Provider 中传递频繁变化的复杂对象：

```jsx
// ❌ 不好的做法：每次渲染都创建新对象
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// ✅ 优化：使用useMemo记忆化值对象
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    const value = useMemo(() => {
        return { theme, setTheme };
    }, [theme]); // 只在theme变化时创建新对象

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
```

### 拆分 Context 以避免不必要的重渲染

将不同关注点的状态拆分到多个 Context 中，可以避免不相关状态变化导致的不必要重渲染：

```jsx
// ❌ 不好的做法：将所有状态放在一个Context中
const AppContext = createContext();

function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState("light");
    const [notifications, setNotifications] = useState([]);

    const value = {
        user,
        setUser,
        theme,
        setTheme,
        notifications,
        setNotifications,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ✅ 优化：拆分为多个Context
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

function AppProviders({ children }) {
    return (
        <UserProvider>
            <ThemeProvider>
                <NotificationProvider>{children}</NotificationProvider>
            </ThemeProvider>
        </UserProvider>
    );
}
```

### 消费组件的优化

可以使用`React.memo`来避免不必要的渲染：

```jsx
const UserInfo = React.memo(function UserInfo() {
    const { user } = useContext(UserContext);
    return <div>{user.name}</div>;
});
```

## 常见用途

1. **主题切换**：如前面的例子所示

2. **当前用户信息**：存储和共享登录用户信息

3. **多语言支持**：

```jsx
const messages = {
    zh: { greeting: "你好", farewell: "再见" },
    en: { greeting: "Hello", farewell: "Goodbye" },
};

function App() {
    const [language, setLanguage] = useState("zh");

    return (
        <LanguageContext.Provider value={{ language, setLanguage, messages }}>
            <Header />
            <MainContent />
            <Footer />
        </LanguageContext.Provider>
    );
}
```

4. **路由信息**：React Router 使用 Context 共享路由状态

5. **表单状态**：在复杂表单中共享表单状态和验证信息

## 最佳实践

1. **避免过深的 Context 嵌套**：多个 Context Provider 嵌套会使代码难以维护

2. **适当粒度的 Context**：既不要过于细粒度（导致嵌套过多），也不要过于粗粒度（导致不必要的重渲染）

3. **创建自定义 Hook**：封装 Context 逻辑到自定义 Hook 中，简化使用

4. **提供默认值**：在`createContext()`中提供有意义的默认值，让组件在 Provider 外也能正常工作

5. **注意性能**：使用`useMemo`记忆化 Provider 的 value，避免不必要的重渲染

6. **使用 TypeScript 增强类型安全**：

```tsx
interface ThemeContextType {
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
```

## 与其他状态管理工具对比

| 特性     | useContext + useReducer | Redux            | MobX       | Recoil     |
| -------- | ----------------------- | ---------------- | ---------- | ---------- |
| 学习曲线 | 低（React 内置）        | 中               | 中         | 低         |
| 样板代码 | 少                      | 多               | 少         | 少         |
| 性能优化 | 需手动优化              | DevTools，中间件 | 自动追踪   | 自动优化   |
| 适用场景 | 中小型应用              | 大型应用         | 中大型应用 | React 应用 |
| 生态系统 | React 内置              | 丰富             | 适中       | 较新       |

## 何时使用 Context

Context 主要应用于"共享全局数据"的场景，例如：

-   主题（明暗模式）
-   用户信息
-   语言偏好
-   路由信息

**不适合使用 Context 的情况**：

-   组件间通信可以通过简单的 props 传递
-   只需要在几个相邻组件间共享状态
-   频繁变化的状态（可能导致性能问题）

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念和规则
-   [[02-useState|useState]] - 管理组件状态
-   [[05-useReducer|useReducer]] - 状态管理的另一个 Hook，常与 useContext 配合使用
