# useRef Hook

#hooks #引用 #DOM 操作

`useRef` 是 React 的一个内置 Hook，它提供了一种方式来存储可变的值，这个值在组件重新渲染时保持不变。`useRef`最常见的用途是访问 DOM 元素，但它也可以用来存储任何可变值，而不会触发组件重新渲染。

## 基本概念

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数。返回的对象在组件的整个生命周期内保持不变。

### 语法

```jsx
const refContainer = useRef(initialValue);
```

参数：

-   `initialValue`: ref 对象的`.current`属性的初始值

返回值：

-   一个可变的 ref 对象，它的`.current`属性被设置为传入的初始值

重要特性：

-   `.current`属性的变化不会触发组件重新渲染
-   ref 对象在组件的整个生命周期内保持不变（引用相等）

## 基本用法

### 1. 引用 DOM 元素

```jsx
import React, { useRef, useEffect } from "react";

function TextInputWithFocusButton() {
    // 创建一个ref来存储文本输入DOM元素
    const inputEl = useRef(null);

    // 点击按钮时聚焦输入框
    const onButtonClick = () => {
        // `current` 指向已挂载到DOM上的input元素
        inputEl.current.focus();
    };

    return (
        <>
            <input ref={inputEl} type="text" />
            <button onClick={onButtonClick}>聚焦输入框</button>
        </>
    );
}
```

### 2. 保存任意可变值

```jsx
import React, { useState, useRef, useEffect } from "react";

function StopWatch() {
    const [count, setCount] = useState(0);
    const [running, setRunning] = useState(false);

    // 使用useRef存储定时器ID
    const timerRef = useRef(null);

    // 使用useRef存储上一次的时间戳
    const startTimeRef = useRef(0);

    const handleStart = () => {
        setRunning(true);
        startTimeRef.current = Date.now() - count * 10;
        timerRef.current = setInterval(() => {
            setCount(Math.floor((Date.now() - startTimeRef.current) / 10));
        }, 10);
    };

    const handleStop = () => {
        setRunning(false);
        clearInterval(timerRef.current);
    };

    const handleReset = () => {
        setCount(0);
        setRunning(false);
        clearInterval(timerRef.current);
    };

    // 组件卸载时清除定时器
    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
        };
    }, []);

    // 格式化时间显示
    const formatTime = (time) => {
        const minutes = Math.floor(time / 6000);
        const seconds = Math.floor((time % 6000) / 100);
        const centiseconds = time % 100;

        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
    };

    return (
        <div>
            <h2>秒表</h2>
            <div>{formatTime(count)}</div>

            {!running ? (
                <button onClick={handleStart}>开始</button>
            ) : (
                <button onClick={handleStop}>停止</button>
            )}

            <button onClick={handleReset}>重置</button>
        </div>
    );
}
```

## useRef 的关键特性

### 1. 持久性

`useRef`创建的对象在组件的整个生命周期内保持不变，即使组件重新渲染，这个对象的引用也不会改变。

```jsx
function PersistentComponent() {
    const renders = useRef(0);

    // 每次渲染都增加计数，但不会触发新的渲染
    renders.current++;

    return <div>组件已渲染 {renders.current} 次</div>;
}
```

### 2. 可变性

`useRef`对象的`.current`属性是可变的，我们可以随时修改它而不会导致组件重新渲染。

```jsx
function MutableExample() {
    const [, forceRender] = useState({});
    const countRef = useRef(0);

    const handleClick = () => {
        // 修改ref的.current不会触发渲染
        countRef.current++;
        console.log(`当前计数: ${countRef.current}`);
    };

    return (
        <div>
            <p>当前计数: {countRef.current}</p>
            <button onClick={handleClick}>增加计数(检查控制台)</button>
            <button onClick={() => forceRender({})}>强制重新渲染</button>
        </div>
    );
}
```

### 3. 与 useState 的区别

`useRef`和`useState`都可以在渲染之间保持状态，但有重要区别：

```jsx
function ComparisonExample() {
    // useState: 值变化会触发重新渲染
    const [stateCount, setStateCount] = useState(0);

    // useRef: 值变化不会触发重新渲染
    const refCount = useRef(0);

    return (
        <div>
            <p>State计数: {stateCount}</p>
            <p>Ref计数: {refCount.current}</p>

            <button onClick={() => setStateCount(stateCount + 1)}>
                增加State (会重新渲染)
            </button>

            <button
                onClick={() => {
                    refCount.current++;
                    console.log(`Ref计数: ${refCount.current}`);
                }}
            >
                增加Ref (不会重新渲染，检查控制台)
            </button>
        </div>
    );
}
```

## 常见使用场景

### 1. DOM 操作和测量

```jsx
function MeasureExample() {
    const divRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (divRef.current) {
            const { width, height } = divRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, []);

    return (
        <div>
            <div
                ref={divRef}
                style={{
                    width: "100%",
                    height: "100px",
                    background: "lightblue",
                    marginBottom: "10px",
                }}
            >
                测量我的尺寸
            </div>
            <p>
                宽度: {dimensions.width}px, 高度: {dimensions.height}px
            </p>
        </div>
    );
}
```

### 2. 跟踪前一个值

```jsx
function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function Counter() {
    const [count, setCount] = useState(0);
    const previousCount = usePrevious(count);

    return (
        <div>
            <p>
                当前值: {count}, 前一个值:{" "}
                {previousCount !== undefined ? previousCount : "无"}
            </p>
            <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
    );
}
```

### 3. 定时器和清理

```jsx
function DelayedMessage() {
    const [message, setMessage] = useState("");
    const [input, setInput] = useState("");
    const timeoutRef = useRef(null);

    const handleChange = (e) => {
        setInput(e.target.value);

        // 清除之前的定时器
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // 设置新的定时器
        timeoutRef.current = setTimeout(() => {
            setMessage(`你输入了: ${e.target.value}`);
        }, 1000);
    };

    // 组件卸载时清除定时器
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="输入后1秒钟将显示消息"
            />
            <p>{message}</p>
        </div>
    );
}
```

### 4. 缓存复杂计算

虽然`useMemo`通常用于缓存计算，但有时我们需要在一个渲染周期内多次访问缓存的值，此时可以使用`useRef`：

```jsx
function ExpensiveCalculation({ data }) {
    const calculationRef = useRef(null);

    // 只在数据变化或首次渲染时计算
    if (
        calculationRef.current === null ||
        calculationRef.current.data !== data
    ) {
        calculationRef.current = {
            data,
            result: performExpensiveCalculation(data),
        };
    }

    // 多次访问计算结果
    const result = calculationRef.current.result;

    return (
        <div>
            <p>计算结果: {result}</p>
            <SomeComponent result={result} />
            <AnotherComponent result={result} />
        </div>
    );
}
```

### 5. 实现 forwardRef

`useRef`常与`forwardRef`一起使用，将 ref 从父组件传递到子组件：

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";

// 子组件使用forwardRef接收父组件传递的ref
const FancyInput = forwardRef((props, ref) => {
    const inputRef = useRef();

    // 向父组件暴露自定义方法
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus();
        },
        clear: () => {
            inputRef.current.value = "";
        },
    }));

    return <input ref={inputRef} {...props} />;
});

// 父组件
function Parent() {
    const fancyInputRef = useRef();

    return (
        <div>
            <FancyInput ref={fancyInputRef} placeholder="输入文本" />
            <button onClick={() => fancyInputRef.current.focus()}>
                聚焦输入框
            </button>
            <button onClick={() => fancyInputRef.current.clear()}>
                清空输入框
            </button>
        </div>
    );
}
```

### 6. 管理表单状态

```jsx
function UncontrolledForm() {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const messageRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            message: messageRef.current.value,
        };

        console.log("提交的表单数据:", formData);

        // 清空表单
        nameRef.current.value = "";
        emailRef.current.value = "";
        messageRef.current.value = "";
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">姓名:</label>
                <input id="name" ref={nameRef} type="text" required />
            </div>

            <div>
                <label htmlFor="email">邮箱:</label>
                <input id="email" ref={emailRef} type="email" required />
            </div>

            <div>
                <label htmlFor="message">留言:</label>
                <textarea id="message" ref={messageRef} required />
            </div>

            <button type="submit">提交</button>
        </form>
    );
}
```

## useRef 与闭包陷阱

使用`useRef`可以避免 React 闭包陷阱（Closure Trap）问题：

```jsx
function ClosureTrapExample() {
    const [count, setCount] = useState(0);

    // ❌ 闭包陷阱
    const handleAlertWithState = () => {
        setTimeout(() => {
            alert(`当前计数: ${count}`); // 会捕获创建时的count值
        }, 3000);
    };

    // ✅ 使用useRef避免闭包陷阱
    const countRef = useRef(count);

    // 保持ref与state同步
    useEffect(() => {
        countRef.current = count;
    }, [count]);

    const handleAlertWithRef = () => {
        setTimeout(() => {
            alert(`当前计数: ${countRef.current}`); // 始终获取最新值
        }, 3000);
    };

    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
            <button onClick={handleAlertWithState}>
                3秒后弹出State值(闭包陷阱)
            </button>
            <button onClick={handleAlertWithRef}>3秒后弹出Ref值(最新值)</button>
        </div>
    );
}
```

## 使用 useRef 处理边缘情况

### 1. 异步操作和组件卸载

使用`useRef`可以安全地处理异步操作中的组件卸载情况：

```jsx
function AsyncExample() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // 使用ref跟踪组件是否已挂载
    const isMountedRef = useRef(true);

    useEffect(() => {
        // 组件挂载时设置为true
        isMountedRef.current = true;

        // 组件卸载时设置为false
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);

        try {
            // 模拟API请求
            const response = await fetch("https://api.example.com/data");
            const result = await response.json();

            // 只有在组件仍然挂载时才更新状态
            if (isMountedRef.current) {
                setData(result);
                setLoading(false);
            }
        } catch (error) {
            // 只有在组件仍然挂载时才更新状态
            if (isMountedRef.current) {
                console.error("获取数据失败:", error);
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <button onClick={fetchData} disabled={loading}>
                {loading ? "加载中..." : "获取数据"}
            </button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}
```

### 2. 管理复杂的动画

```jsx
function AnimationExample() {
    const elementRef = useRef(null);
    const animationRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const startAnimation = () => {
        if (!elementRef.current) return;

        setIsAnimating(true);
        let start = null;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;

            // 计算0-360度的角度
            const rotation = (progress / 20) % 360;

            if (elementRef.current) {
                elementRef.current.style.transform = `rotate(${rotation}deg)`;
            }

            // 继续动画循环
            animationRef.current = requestAnimationFrame(animate);
        };

        // 开始动画循环
        animationRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        setIsAnimating(false);
    };

    // 组件卸载时停止动画
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div>
            <div
                ref={elementRef}
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "coral",
                    margin: "20px auto",
                }}
            >
                旋转的方块
            </div>

            {!isAnimating ? (
                <button onClick={startAnimation}>开始旋转</button>
            ) : (
                <button onClick={stopAnimation}>停止旋转</button>
            )}
        </div>
    );
}
```

## 最佳实践

1. **正确初始化**：总是为`useRef`提供一个初始值，即使是`null`

```jsx
// ✅ 好的做法
const inputRef = useRef(null);
const countRef = useRef(0);
```

2. **避免过度使用**：不要为了避免重新渲染而过度使用`useRef`，有时`useState`更合适

```jsx
// ❌ 不恰当的使用
function Counter() {
    const countRef = useRef(0);

    return (
        <div>
            <p>计数: {countRef.current}</p>
            <button
                onClick={() => {
                    countRef.current++;
                    // 这不会导致组件重新渲染，UI不会更新!
                }}
            >
                增加
            </button>
        </div>
    );
}

// ✅ 更好的做法
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
    );
}
```

3. **保持.current 的同步**：如果 ref 需要与 state 同步，使用 useEffect

```jsx
function SyncedComponent() {
    const [value, setValue] = useState("");
    const valueRef = useRef(value);

    // 保持ref与state同步
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    // ...
}
```

4. **清理资源**：在组件卸载时清理任何使用 ref 创建的资源

```jsx
function CleanupExample() {
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            console.log("计时器运行中...");
        }, 1000);

        return () => {
            clearInterval(timerRef.current);
        };
    }, []);

    // ...
}
```

5. **区分 DOM refs 和普通 refs**：使用命名约定区分不同用途的 refs

```jsx
function MixedRefsExample() {
    // DOM引用使用Element后缀
    const buttonRef = useRef(null);

    // 普通值引用使用明确的名称
    const countRef = useRef(0);
    const prevValueRef = useRef(null);

    // ...
}
```

## 与其他 Hooks 的结合使用

### 与 useEffect 结合

```jsx
function CombinedExample() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();

    useEffect(() => {
        // 在渲染后更新ref
        prevCountRef.current = count;
    });

    const prevCount = prevCountRef.current;

    return (
        <div>
            <p>
                当前: {count}, 之前:{" "}
                {prevCount !== undefined ? prevCount : "无"}
            </p>
            <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
    );
}
```

### 与 useCallback 结合

```jsx
function SearchComponent() {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const abortControllerRef = useRef(null);

    const fetchResults = useCallback(async (searchQuery) => {
        // 取消之前的请求
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 创建新的AbortController
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch(
                `https://api.example.com/search?q=${searchQuery}`,
                { signal: abortControllerRef.current.signal }
            );
            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("搜索出错:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (query.length >= 3) {
            fetchResults(query);
        }
    }, [query, fetchResults]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入搜索关键词..."
            />

            <ul>
                {results.map((result) => (
                    <li key={result.id}>{result.title}</li>
                ))}
            </ul>
        </div>
    );
}
```

## TypeScript 中使用 useRef

在 TypeScript 中，可以为 useRef 指定泛型类型：

```tsx
import React, { useRef, useEffect } from "react";

// DOM元素的ref
function InputFocus() {
    // HTMLInputElement类型的ref
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
        // 因为初始值为null，所以需要检查
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>聚焦</button>
        </div>
    );
}

// 可变值的ref
function Counter() {
    // 为数字类型的ref，初始值为0
    const countRef = useRef<number>(0);

    // 为可能为null的复杂类型定义ref
    interface User {
        id: string;
        name: string;
    }

    const userRef = useRef<User | null>(null);

    useEffect(() => {
        // 设置复杂类型值
        userRef.current = { id: "1", name: "Alice" };

        // 读取和修改值
        console.log(`用户: ${userRef.current?.name}`);
        countRef.current += 1;
    }, []);

    return <div>TypeScript Ref示例</div>;
}
```

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - React Hooks 的基本概念和规则
-   [[02-useState|useState]] - 比较 useState 和 useRef 的使用场景
-   [[03-useEffect|useEffect]] - 常与 useRef 一起使用进行 DOM 操作和清理
-   [[06-useCallback|useCallback]] - 可与 useRef 结合优化性能
