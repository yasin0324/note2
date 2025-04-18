# useCallback Hook

#hooks #性能优化 #记忆化

`useCallback` 是 React 的一个内置 Hook，它用于记忆化回调函数，避免在每次渲染时创建新的函数实例。这对于性能优化特别有用，尤其是当回调函数作为 props 传递给子组件时。

## 基本概念

`useCallback` 返回一个记忆化（memoized）的回调函数，只有当依赖项发生变化时，才会返回新的函数实例。这有助于避免不必要的渲染和计算。

### 语法

```jsx
const memoizedCallback = useCallback(
    () => {
        // 回调函数的逻辑
        doSomething(a, b);
    },
    [a, b] // 依赖项数组
);
```

参数：

-   第一个参数是要记忆化的回调函数
-   第二个参数是依赖项数组，只有当数组中的值发生变化时，才会返回新的函数

返回值：

-   返回记忆化的回调函数，该函数在依赖项不变的情况下保持相同的引用

## 基本用法

```jsx
import React, { useState, useCallback } from "react";

function Counter() {
    const [count, setCount] = useState(0);
    const [otherState, setOtherState] = useState(0);

    // 不使用useCallback - 每次渲染都会创建新的函数实例
    const incrementWithoutCallback = () => {
        setCount(count + 1);
    };

    // 使用useCallback - 只有当count变化时才会创建新的函数实例
    const incrementWithCallback = useCallback(() => {
        setCount(count + 1);
    }, [count]);

    return (
        <div>
            <p>计数: {count}</p>
            <p>其他状态: {otherState}</p>
            <button onClick={incrementWithCallback}>增加计数</button>
            <button onClick={() => setOtherState(otherState + 1)}>
                增加其他状态
            </button>
        </div>
    );
}
```

在上面的例子中，当`otherState`发生变化导致组件重新渲染时，`incrementWithCallback`函数不会重新创建，而`incrementWithoutCallback`会在每次渲染时重新创建。

## 为什么需要 useCallback

在 React 中，当组件重新渲染时，内部定义的函数会被重新创建。这通常不是问题，但在以下情况下可能导致性能问题：

1. 当函数作为 props 传递给 React.memo()包装的子组件时
2. 当函数被用作其他 Hooks（如 useEffect）的依赖项时
3. 当函数创建开销较大时

### 不使用 useCallback 的问题

```jsx
function ParentComponent() {
    const [count, setCount] = useState(0);

    // 每次ParentComponent渲染，handleClick都是新函数
    const handleClick = () => {
        console.log("按钮被点击");
    };

    return (
        <div>
            <p>点击次数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>

            {/* ExpensiveChild会在每次ParentComponent渲染时重新渲染，
          因为handleClick总是新的函数引用 */}
            <ExpensiveChild onClick={handleClick} />
        </div>
    );
}

const ExpensiveChild = React.memo(function ExpensiveChild({ onClick }) {
    console.log("ExpensiveChild渲染");
    return <button onClick={onClick}>点击我</button>;
});
```

### 使用 useCallback 解决问题

```jsx
function ParentComponent() {
    const [count, setCount] = useState(0);

    // handleClick被记忆化，只有在依赖项变化时才会更新
    const handleClick = useCallback(() => {
        console.log("按钮被点击");
    }, []); // 空依赖数组意味着这个函数不会重新创建

    return (
        <div>
            <p>点击次数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>

            {/* 现在ExpensiveChild只会在handleClick变化时重新渲染，
          而不是在每次ParentComponent渲染时 */}
            <ExpensiveChild onClick={handleClick} />
        </div>
    );
}
```

## 与 React.memo 结合使用

`useCallback`通常与`React.memo`一起使用，实现组件的性能优化：

```jsx
import React, { useState, useCallback } from "react";

function Parent() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    // 记忆化回调函数
    const handleClick = useCallback(() => {
        setCount((c) => c + 1);
    }, []); // 没有依赖项，函数引用永远不变

    return (
        <div>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入文本"
            />
            <p>文本: {text}</p>
            <p>计数: {count}</p>

            {/* 即使Parent因为text变化而重新渲染，
          ChildComponent也不会重新渲染，因为handleClick没有变化 */}
            <ChildComponent onClick={handleClick} count={count} />
        </div>
    );
}

// 使用React.memo包装子组件，只有当props变化时才会重新渲染
const ChildComponent = React.memo(function ChildComponent({ onClick, count }) {
    console.log("ChildComponent渲染");
    return (
        <div>
            <p>子组件计数: {count}</p>
            <button onClick={onClick}>增加</button>
        </div>
    );
});
```

## 依赖项的处理

### 空依赖数组

如果提供空依赖数组`[]`，`useCallback`将在组件的整个生命周期中只创建一次回调函数：

```jsx
const handleClick = useCallback(() => {
    console.log("这个函数只会被创建一次");
}, []);
```

这适用于不依赖于任何组件状态或 props 的回调函数。

### 依赖状态或属性

当回调函数依赖于组件的状态或 props 时，应将这些值添加到依赖数组中：

```jsx
const handleSubmit = useCallback(() => {
    api.saveUser(username, email);
}, [username, email]); // 当username或email变化时，创建新的函数
```

### 使用函数式更新减少依赖

在处理状态更新时，可以使用函数式更新来减少依赖：

```jsx
// ❌ 依赖于count
const increment = useCallback(() => {
    setCount(count + 1);
}, [count]); // count变化时会创建新函数

// ✅ 不依赖于count
const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
}, []); // 没有依赖，不会创建新函数
```

### 处理依赖项中的引用类型

当依赖项是对象、数组或函数时，需要注意它们的引用可能在每次渲染时都会改变：

```jsx
function SearchComponent({ term }) {
    // ❌ 对象在每次渲染时都是新的，导致useCallback总是返回新函数
    const options = { caseSensitive: false, fullWord: true };

    const search = useCallback(() => {
        performSearch(term, options);
    }, [term, options]); // options总是新引用，导致search总是新函数

    // ✅ 应该这样处理
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [fullWord, setFullWord] = useState(true);

    const search = useCallback(() => {
        const options = { caseSensitive, fullWord };
        performSearch(term, options);
    }, [term, caseSensitive, fullWord]); // 依赖基本类型值
}
```

## 与 useEffect 结合使用

`useCallback`常与`useEffect`结合使用，可以避免因回调函数变化导致的不必要的副作用执行：

```jsx
function DataFetcher({ query }) {
    const [data, setData] = useState(null);

    // 记忆化获取数据的函数
    const fetchData = useCallback(async () => {
        const response = await fetch(`/api/search?q=${query}`);
        const json = await response.json();
        setData(json);
    }, [query]); // 只有query变化时才会创建新函数

    // 使用fetchData作为依赖
    useEffect(() => {
        fetchData();
    }, [fetchData]); // 当fetchData变化时执行副作用

    return <div>{/* 渲染数据 */}</div>;
}
```

## 与 useMemo 的区别

`useCallback`和`useMemo`都用于记忆化，但有重要区别：

-   `useCallback(fn, deps)` 记忆化**函数本身**
-   `useMemo(() => fn, deps)` 记忆化**函数的返回值**

它们的关系可以表示为：

```js
useCallback(fn, deps) 等价于 useMemo(() => fn, deps)
```

选择使用哪一个取决于你的需求：

-   如果需要记忆化函数引用（例如作为 props 传递给子组件），使用`useCallback`
-   如果需要记忆化计算结果（例如复杂计算），使用`useMemo`

## 性能考虑

使用`useCallback`本身也有性能成本，不应过度使用：

1. 对于**每个组件渲染只执行一次**的简单函数，不需要使用`useCallback`
2. 对于**不作为 props 传递给子组件**的函数，通常不需要使用`useCallback`
3. 对于**React.memo()包装的子组件接收的回调 props**，使用`useCallback`是有意义的

```jsx
function Parent() {
    // ❌ 不需要useCallback的情况
    const handleSimpleAction = useCallback(() => {
        console.log("简单操作");
    }, []); // 过度优化

    // ✅ 需要useCallback的情况
    const handleChildAction = useCallback(() => {
        console.log("传给子组件的回调");
    }, []); // 避免MemoizedChild不必要的重新渲染

    return (
        <div>
            <button onClick={() => console.log("内联也可以")}>点击</button>
            <MemoizedChild onAction={handleChildAction} />
        </div>
    );
}
```

## 实践中的一些用例

### 1. 事件处理函数

```jsx
function Form() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            alert(`提交的数据: ${name}, ${email}`);
        },
        [name, email]
    );

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="姓名"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱"
            />
            <MemoizedSubmitButton onClick={handleSubmit} />
        </form>
    );
}
```

### 2. 自定义 Hook 中共享逻辑

```jsx
function useSearch(initialQuery = "") {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = useCallback(async () => {
        if (!query) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/search?q=${query}`);
            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            console.error("搜索出错:", error);
        } finally {
            setLoading(false);
        }
    }, [query]);

    // 返回记忆化的函数
    return {
        query,
        setQuery,
        results,
        loading,
        search,
    };
}
```

### 3. 防抖和节流

```jsx
function SearchInput() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    // 使用useCallback创建防抖函数
    const debouncedSearch = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm.length < 3) return;

            const response = await fetch(`/api/search?q=${searchTerm}`);
            const data = await response.json();
            setResults(data.results);
        }, 500),
        [] // 空依赖数组确保防抖函数只创建一次
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="搜索..."
            />
            {results.map((result) => (
                <div key={result.id}>{result.title}</div>
            ))}
        </div>
    );
}

// 简单的防抖函数实现
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
```

## TypeScript 中使用 useCallback

在 TypeScript 项目中，可以为 useCallback 提供明确的类型注解：

```tsx
import React, { useState, useCallback } from "react";

interface Item {
    id: number;
    name: string;
}

function ItemList() {
    const [items, setItems] = useState<Item[]>([]);

    // 为回调函数提供类型
    const handleAddItem = useCallback((name: string): void => {
        const newItem: Item = {
            id: Date.now(),
            name,
        };
        setItems((prevItems) => [...prevItems, newItem]);
    }, []);

    const handleRemoveItem = useCallback((id: number): void => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }, []);

    return (
        <div>
            <button onClick={() => handleAddItem("新项目")}>添加项目</button>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.name}
                        <button onClick={() => handleRemoveItem(item.id)}>
                            删除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

## 最佳实践

1. **明智地使用**：不是所有函数都需要 useCallback。只在有明确性能优势时使用。

2. **正确设置依赖项**：确保依赖项数组包含回调函数内部使用的所有状态和 props。

3. **使用函数式更新**：对于状态更新，尽可能使用函数式更新以减少依赖项。

4. **与 React.memo 结合**：useCallback 对于优化 React.memo 包装的组件特别有用。

5. **避免过度优化**：过早优化可能导致代码复杂度增加但性能受益有限。

6. **考虑替代方案**：有时，将函数直接传递给子组件或使用 context 可能比 useCallback 更简单。

## 常见问题和解决方法

### 依赖过多导致回调频繁重建

```jsx
// ❌ 问题：依赖太多，函数经常重建
const handleComplexAction = useCallback(() => {
    processData(data, options, filters, sorting, pagination);
}, [data, options, filters, sorting, pagination]);

// ✅ 解决方案：将相关状态合并为一个对象，使用useMemo记忆化
const processConfig = useMemo(() => {
    return { data, options, filters, sorting, pagination };
}, [data, options, filters, sorting, pagination]);

const handleComplexAction = useCallback(() => {
    processData(processConfig);
}, [processConfig]); // 依赖减少到一个
```

### 误用空依赖数组

```jsx
// ❌ 问题：使用了过时的closures
const handleSubmit = useCallback(() => {
    // 这里使用的formData永远是初始值，而非最新值
    submitForm(formData);
}, []); // 缺少formData依赖

// ✅ 解决方案：添加正确的依赖
const handleSubmit = useCallback(() => {
    submitForm(formData);
}, [formData]); // 正确添加依赖
```

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念和规则
-   [[07-useMemo|useMemo]] - 记忆化计算结果的 Hook
-   [[03-useEffect|useEffect]] - 常与 useCallback 结合使用
-   [[React.memo]] - 函数组件的性能优化

```

```
