# useMemo Hook

#hooks #性能优化 #记忆化

`useMemo` 是 React 的一个内置 Hook，用于记忆化计算结果。它可以帮助优化应用性能，避免在每次渲染时重复进行昂贵的计算。

## 基本概念

`useMemo` 会在依赖项变化时才重新计算记忆化的值，这有助于避免在每次渲染时都进行昂贵的计算。

### 语法

```jsx
const memoizedValue = useMemo(() => {
    // 执行复杂计算并返回结果
    return computeExpensiveValue(a, b);
}, [a, b]); // 依赖项数组
```

参数：

-   第一个参数是一个函数，返回要记忆化的值
-   第二个参数是依赖项数组，只有当数组中的值发生变化时，才会重新执行第一个函数

返回值：

-   返回记忆化的值

## 基本用法

```jsx
import React, { useState, useMemo } from "react";

function ExpensiveCalculation({ a, b }) {
    const [unrelatedState, setUnrelatedState] = useState(0);

    // 不使用useMemo - 每次渲染都会重新计算
    const resultWithoutMemo = computeExpensiveValue(a, b);

    // 使用useMemo - 只有当a或b变化时才会重新计算
    const resultWithMemo = useMemo(() => {
        console.log("计算结果...");
        return computeExpensiveValue(a, b);
    }, [a, b]);

    return (
        <div>
            <p>计算结果: {resultWithMemo}</p>
            <p>无关状态: {unrelatedState}</p>
            <button onClick={() => setUnrelatedState(unrelatedState + 1)}>
                更新无关状态
            </button>
        </div>
    );
}

// 模拟昂贵计算
function computeExpensiveValue(a, b) {
    console.log("执行昂贵计算...");
    // 模拟耗时操作
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += i;
    }
    return a + b + result;
}
```

在上面的例子中，当点击按钮更新`unrelatedState`时，组件会重新渲染，但由于`a`和`b`没有变化，`resultWithMemo`不会重新计算，而`resultWithoutMemo`会在每次渲染时都重新计算。

## 为什么需要 useMemo

`useMemo` 主要用于以下场景：

1. **优化昂贵的计算**：避免在每次渲染时都执行昂贵的计算，如复杂数据的排序、过滤或转换。

2. **避免不必要的子组件渲染**：当创建的值作为 props 传递给子组件时，使用 `useMemo` 可以避免因引用变化导致子组件不必要的重新渲染。

3. **防止引用相等性问题**：对于对象和数组等引用类型，每次渲染时都会创建新的引用，使用 `useMemo` 可以在依赖项不变时保持相同的引用。

## 具体使用场景

### 1. 昂贵的计算

```jsx
function SearchResults({ items, query }) {
    // 使用useMemo优化过滤操作
    const filteredItems = useMemo(() => {
        console.log("过滤项目...");
        return items.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [items, query]); // 仅当items或query变化时重新过滤

    return (
        <ul>
            {filteredItems.map((item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}
```

### 2. 避免子组件不必要的渲染

```jsx
function ParentComponent({ userIds }) {
    // 使用useMemo创建用户列表对象，避免每次渲染创建新对象
    const usersList = useMemo(() => {
        return { userIds, version: "1.0" };
    }, [userIds]); // 仅当userIds变化时创建新对象

    return <UsersList list={usersList} />;
}

// 使用React.memo避免不必要的重新渲染
const UsersList = React.memo(function UsersList({ list }) {
    console.log("UsersList渲染");
    return (
        <div>
            <h2>用户列表 (版本: {list.version})</h2>
            <ul>
                {list.userIds.map((id) => (
                    <li key={id}>用户 {id}</li>
                ))}
            </ul>
        </div>
    );
});
```

### 3. 复杂的派生状态

```jsx
function Dashboard({ orders }) {
    // 从订单数据中计算统计信息
    const stats = useMemo(() => {
        return {
            total: orders.length,
            completed: orders.filter((o) => o.status === "completed").length,
            totalValue: orders.reduce((sum, order) => sum + order.value, 0),
            averageValue: orders.length
                ? orders.reduce((sum, order) => sum + order.value, 0) /
                  orders.length
                : 0,
        };
    }, [orders]);

    return (
        <div>
            <h2>订单统计</h2>
            <p>总订单: {stats.total}</p>
            <p>已完成: {stats.completed}</p>
            <p>总价值: ¥{stats.totalValue.toFixed(2)}</p>
            <p>平均价值: ¥{stats.averageValue.toFixed(2)}</p>
        </div>
    );
}
```

## 与 useCallback 的对比

`useMemo` 和 `useCallback` 都用于记忆化，但有重要区别：

-   `useMemo(() => value, deps)` 记忆化**计算的结果**
-   `useCallback(fn, deps)` 记忆化**函数本身**

它们的关系可以表示为：

```js
useCallback(fn, deps) 等价于 useMemo(() => fn, deps)
```

选择使用哪一个取决于你的需求：

-   如果需要记忆化计算结果（如数据处理的结果），使用 `useMemo`
-   如果需要记忆化函数引用（如事件处理函数），使用 `useCallback`

## 依赖项处理

与 `useEffect` 和 `useCallback` 类似，`useMemo` 的第二个参数是依赖项数组，决定何时重新计算值：

### 1. 空依赖数组

如果提供空依赖数组 `[]`，`useMemo` 将只在组件挂载时计算一次值：

```jsx
// 只在组件挂载时计算一次
const value = useMemo(() => {
    return computeExpensiveInitialValue();
}, []);
```

### 2. 没有提供依赖数组

如果不提供依赖数组，`useMemo` 将在每次渲染时都重新计算值，这样就失去了记忆化的意义：

```jsx
// ❌ 不推荐：每次渲染都会重新计算
const value = useMemo(() => {
    return computeExpensiveValue(a, b);
}); // 没有依赖数组
```

### 3. 依赖引用类型

对于引用类型的依赖，需要特别注意处理方式：

```jsx
function Component() {
    // ❌ 问题：options在每次渲染时都是新对象
    const options = { threshold: 0.5, rootMargin: "0px" };

    const value = useMemo(() => {
        return computeWithOptions(options);
    }, [options]); // options引用每次都变化，useMemo失效

    // ✅ 解决方案1：将依赖项分解为基本类型
    const value = useMemo(() => {
        const options = { threshold: threshold, rootMargin: rootMargin };
        return computeWithOptions(options);
    }, [threshold, rootMargin]); // 依赖基本类型值

    // ✅ 解决方案2：使用useMemo记忆化options对象
    const options = useMemo(() => {
        return { threshold: threshold, rootMargin: rootMargin };
    }, [threshold, rootMargin]);

    const value = useMemo(() => {
        return computeWithOptions(options);
    }, [options]); // 依赖记忆化的options
}
```

## 性能考虑

使用 `useMemo` 本身也有成本，不应过度使用：

1. **记忆化有开销**：`useMemo` 会占用额外的内存来存储记忆化的值。

2. **依赖检查有成本**：React 需要在每次渲染时检查依赖项是否变化。

3. **过度优化的陷阱**：不应该为每个计算都添加 `useMemo`，只在真正需要的地方使用。

```jsx
function Component({ value }) {
    // ❌ 过度使用：简单计算不需要useMemo
    const doubled = useMemo(() => value * 2, [value]);

    // ✅ 适当使用：昂贵计算才需要useMemo
    const expensiveResult = useMemo(() => {
        return performExpensiveCalculation(value);
    }, [value]);

    return (
        <div>
            <p>简单计算结果: {value * 2}</p>
            <p>昂贵计算结果: {expensiveResult}</p>
        </div>
    );
}
```

## 常见使用模式

### 1. 复杂列表的处理

```jsx
function ProductList({ products, filters, sortBy }) {
    // 处理商品列表
    const processedProducts = useMemo(() => {
        console.log("处理商品列表...");

        // 1. 过滤
        let result = products;
        if (filters.category) {
            result = result.filter((p) => p.category === filters.category);
        }
        if (filters.minPrice) {
            result = result.filter((p) => p.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
            result = result.filter((p) => p.price <= filters.maxPrice);
        }

        // 2. 排序
        return [...result].sort((a, b) => {
            if (sortBy === "price") return a.price - b.price;
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0;
        });
    }, [
        products,
        filters.category,
        filters.minPrice,
        filters.maxPrice,
        sortBy,
    ]);

    return (
        <div>
            <h2>商品列表 ({processedProducts.length}个结果)</h2>
            <ul>
                {processedProducts.map((product) => (
                    <li key={product.id}>
                        {product.name} - ¥{product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### 2. 缓存复杂对象结构

```jsx
function UserDashboard({ userId }) {
    const [userData, setUserData] = useState(null);

    // 获取用户数据
    useEffect(() => {
        fetchUserData(userId).then(setUserData);
    }, [userId]);

    // 构建用户配置信息
    const userConfig = useMemo(() => {
        if (!userData) return null;

        return {
            preferences: {
                theme: userData.preferences?.theme || "light",
                fontSize: userData.preferences?.fontSize || "medium",
                notifications: {
                    email: userData.preferences?.notifications?.email || false,
                    push: userData.preferences?.notifications?.push || true,
                    sms: userData.preferences?.notifications?.sms || false,
                },
            },
            permissions: {
                canEdit:
                    userData.role === "admin" || userData.role === "editor",
                canDelete: userData.role === "admin",
                canInvite: userData.role !== "viewer",
            },
            displayName: userData.firstName + " " + userData.lastName,
            initials: userData.firstName[0] + userData.lastName[0],
        };
    }, [userData]);

    if (!userConfig) return <div>加载中...</div>;

    return (
        <div>
            <UserHeader config={userConfig} />
            <UserPreferences config={userConfig} />
            <UserPermissions config={userConfig} />
        </div>
    );
}
```

### 3. 表单数据的验证

```jsx
function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // 验证表单数据
    const validationErrors = useMemo(() => {
        const errors = {};

        // 用户名验证
        if (formData.username.length < 3) {
            errors.username = "用户名至少需要3个字符";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = "用户名只能包含字母、数字和下划线";
        }

        // 邮箱验证
        if (!formData.email) {
            errors.email = "邮箱不能为空";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = "邮箱格式不正确";
        }

        // 密码验证
        if (formData.password.length < 8) {
            errors.password = "密码至少需要8个字符";
        } else if (!/[A-Z]/.test(formData.password)) {
            errors.password = "密码需要包含至少一个大写字母";
        } else if (!/[0-9]/.test(formData.password)) {
            errors.password = "密码需要包含至少一个数字";
        }

        // 确认密码验证
        if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = "两次输入的密码不一致";
        }

        return errors;
    }, [
        formData.username,
        formData.email,
        formData.password,
        formData.confirmPassword,
    ]);

    // 检查表单是否有效
    const isFormValid = useMemo(() => {
        return (
            Object.keys(validationErrors).length === 0 &&
            formData.username &&
            formData.email &&
            formData.password &&
            formData.confirmPassword
        );
    }, [validationErrors, formData]);

    // 处理表单提交
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            // 提交表单数据
            console.log("提交表单:", formData);
        }
    };

    // 处理输入变化
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>用户名:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                {validationErrors.username && (
                    <p>{validationErrors.username}</p>
                )}
            </div>

            <div>
                <label>邮箱:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {validationErrors.email && <p>{validationErrors.email}</p>}
            </div>

            <div>
                <label>密码:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {validationErrors.password && (
                    <p>{validationErrors.password}</p>
                )}
            </div>

            <div>
                <label>确认密码:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                {validationErrors.confirmPassword && (
                    <p>{validationErrors.confirmPassword}</p>
                )}
            </div>

            <button type="submit" disabled={!isFormValid}>
                注册
            </button>
        </form>
    );
}
```

## TypeScript 中使用 useMemo

在 TypeScript 项目中使用`useMemo`，可以为记忆化的值提供类型：

```tsx
import React, { useState, useMemo } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user" | "guest";
}

interface UserStats {
    totalUsers: number;
    admins: number;
    activeUsers: number;
    averageNameLength: number;
}

function UserDashboard({ users }: { users: User[] }) {
    // 为记忆化的值提供类型
    const userStats: UserStats = useMemo(() => {
        const admins = users.filter((user) => user.role === "admin").length;
        const activeUsers = users.filter(
            (user) => user.lastLogin > Date.now() - 86400000
        ).length;
        const totalNameLength = users.reduce(
            (sum, user) => sum + user.name.length,
            0
        );

        return {
            totalUsers: users.length,
            admins,
            activeUsers,
            averageNameLength: users.length
                ? totalNameLength / users.length
                : 0,
        };
    }, [users]);

    return (
        <div>
            <h2>用户统计</h2>
            <p>总用户数: {userStats.totalUsers}</p>
            <p>管理员数: {userStats.admins}</p>
            <p>活跃用户: {userStats.activeUsers}</p>
            <p>平均名称长度: {userStats.averageNameLength.toFixed(1)}</p>
        </div>
    );
}
```

## 与 React.memo 的结合使用

`useMemo`常与`React.memo`结合使用，优化组件渲染性能：

```jsx
// 父组件
function ParentComponent({ data }) {
    // 使用useMemo记忆化复杂的数据处理
    const processedData = useMemo(() => {
        return processData(data);
    }, [data]);

    return <MemoizedChild data={processedData} />;
}

// 使用React.memo包装子组件
const MemoizedChild = React.memo(function Child({ data }) {
    console.log("Child渲染");
    return <div>{/* 渲染数据 */}</div>;
});
```

## 常见陷阱和解决方案

### 1. 忽略依赖项

```jsx
// ❌ 问题：缺少依赖项
const filteredUsers = useMemo(() => {
    return users.filter((user) => user.name.includes(searchTerm));
}, []); // 缺少users和searchTerm依赖

// ✅ 解决方案：添加所有依赖项
const filteredUsers = useMemo(() => {
    return users.filter((user) => user.name.includes(searchTerm));
}, [users, searchTerm]); // 正确添加依赖
```

### 2. 多层嵌套依赖问题

```jsx
// ❌ 问题：对象嵌套导致依赖难以管理
const userConfig = {
    preferences: {
        theme: "dark",
        fontSize: "large",
    },
};

const themeStyles = useMemo(() => {
    return getThemeStyles(userConfig.preferences.theme);
}, [userConfig]); // 任何preferences变化都会导致重新计算

// ✅ 解决方案：扁平化依赖
const { preferences } = userConfig;
const { theme } = preferences;

const themeStyles = useMemo(() => {
    return getThemeStyles(theme);
}, [theme]); // 只依赖于theme
```

### 3. 过早优化

```jsx
// ❌ 问题：不必要的优化
function SimpleComponent({ value }) {
    // 简单操作不需要useMemo
    const doubledValue = useMemo(() => value * 2, [value]);
    const message = useMemo(() => `当前值是：${value}`, [value]);

    return (
        <div>
            <p>{doubledValue}</p>
            <p>{message}</p>
        </div>
    );
}

// ✅ 更好的做法：只优化真正昂贵的操作
function BetterComponent({ value, data }) {
    // 简单操作直接内联
    const doubledValue = value * 2;
    const message = `当前值是：${value}`;

    // 只对昂贵操作使用useMemo
    const processedData = useMemo(() => {
        return expensiveDataProcessing(data);
    }, [data]);

    return (
        <div>
            <p>{doubledValue}</p>
            <p>{message}</p>
            <DataVisualizer data={processedData} />
        </div>
    );
}
```

## 最佳实践

1. **针对昂贵计算使用**：只在计算成本明显高于依赖项检查成本时使用`useMemo`。

2. **避免过度使用**：不要为每个计算都添加`useMemo`，这反而会增加内存使用和代码复杂度。

3. **正确设置依赖项**：确保依赖数组包含计算中使用的所有变量。

4. **避免复杂依赖**：尽量使用基本类型作为依赖，而不是引用类型。

5. **结合 React.memo 使用**：当计算结果作为 props 传递给 React.memo 包装的组件时，`useMemo`特别有用。

6. **考虑其他优化方式**：有时，将复杂计算移到组件外部，或者使用状态管理库可能是更好的解决方案。

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念和规则
-   [[06-useCallback|useCallback]] - 记忆化回调函数的 Hook
-   [[03-useEffect|useEffect]] - 处理副作用的 Hook
-   [[React.memo]] - 函数组件的性能优化
