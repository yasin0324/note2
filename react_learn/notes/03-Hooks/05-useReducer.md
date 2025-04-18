# useReducer Hook

#hooks #状态管理 #reducer

`useReducer` 是 React 的一个内置 Hook，它是`useState`的替代方案，用于处理复杂的状态逻辑。当组件的状态逻辑较为复杂，包含多个子值，或者下一个状态依赖于之前的状态时，`useReducer`通常会比`useState`更适用。

## 基本概念

`useReducer`基于"reducer 模式"，这一模式在 Redux 等状态管理库中非常流行。其核心思想是：

-   通过分发（dispatch）动作（action）来更新状态
-   使用一个纯函数（reducer）来根据当前状态和动作计算新状态

### 语法

```jsx
const [state, dispatch] = useReducer(reducer, initialState, init);
```

参数：

-   `reducer`: 一个函数，接收当前状态和动作，返回新状态
-   `initialState`: 初始状态值
-   `init`: (可选) 惰性初始化函数，用于计算初始状态

返回值：

-   当前状态值
-   dispatch 函数，用于发送动作更新状态

## 基本用法

下面是一个简单的计数器示例，展示了`useReducer`的基本用法：

```jsx
import React, { useReducer } from "react";

// reducer函数接收当前state和action，返回新state
function counterReducer(state, action) {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        case "reset":
            return { count: 0 };
        default:
            return state;
    }
}

function Counter() {
    // 初始状态为 { count: 0 }
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });

    return (
        <div>
            <p>当前计数: {state.count}</p>
            <button onClick={() => dispatch({ type: "increment" })}>
                增加
            </button>
            <button onClick={() => dispatch({ type: "decrement" })}>
                减少
            </button>
            <button onClick={() => dispatch({ type: "reset" })}>重置</button>
        </div>
    );
}
```

## 惰性初始化

如果初始状态的计算比较复杂，可以使用惰性初始化来优化性能：

```jsx
function init(initialCount) {
    return { count: initialCount };
}

function Counter({ initialCount = 0 }) {
    const [state, dispatch] = useReducer(counterReducer, initialCount, init);

    // 组件其余部分
}
```

这样，`init`函数只会在组件的初始渲染时被调用一次，而不是每次渲染都计算初始状态。

## 与 useState 对比

### useState

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
            <button onClick={() => setCount(count - 1)}>减少</button>
            <button onClick={() => setCount(0)}>重置</button>
        </div>
    );
}
```

### useReducer

```jsx
function Counter() {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "increment":
                return state + 1;
            case "decrement":
                return state - 1;
            case "reset":
                return 0;
            default:
                return state;
        }
    }, 0);

    return (
        <div>
            <p>Count: {state}</p>
            <button onClick={() => dispatch({ type: "increment" })}>
                增加
            </button>
            <button onClick={() => dispatch({ type: "decrement" })}>
                减少
            </button>
            <button onClick={() => dispatch({ type: "reset" })}>重置</button>
        </div>
    );
}
```

## 何时使用 useReducer vs useState

### 适合使用 useState 的情况

-   简单的状态逻辑
-   独立的状态变量，彼此之间没有关联
-   简单的状态更新逻辑

### 适合使用 useReducer 的情况

-   复杂的状态对象，包含多个子值
-   下一个状态依赖于之前的状态
-   相关的状态更新需要一起处理
-   复杂的状态转换逻辑
-   需要在深层组件树中触发状态更新（结合 Context 使用）

## 复杂状态示例

以下是一个购物车功能的例子，展示了如何使用`useReducer`处理复杂状态：

```jsx
import React, { useReducer } from "react";

// 初始状态
const initialState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
};

// Reducer函数
function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM":
            const newItems = [...state.items, action.payload];
            return {
                ...state,
                items: newItems,
                total: newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
            };

        case "REMOVE_ITEM":
            const filteredItems = state.items.filter(
                (item) => item.id !== action.payload.id
            );
            return {
                ...state,
                items: filteredItems,
                total: filteredItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
            };

        case "UPDATE_QUANTITY":
            const updatedItems = state.items.map((item) =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return {
                ...state,
                items: updatedItems,
                total: updatedItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
            };

        case "CHECKOUT_START":
            return { ...state, loading: true, error: null };

        case "CHECKOUT_SUCCESS":
            return { ...initialState };

        case "CHECKOUT_FAILURE":
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}

function ShoppingCart() {
    const [cart, dispatch] = useReducer(cartReducer, initialState);

    const addItem = (product) => {
        dispatch({
            type: "ADD_ITEM",
            payload: { ...product, quantity: 1 },
        });
    };

    const removeItem = (id) => {
        dispatch({
            type: "REMOVE_ITEM",
            payload: { id },
        });
    };

    const updateQuantity = (id, quantity) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id, quantity },
        });
    };

    const checkout = async () => {
        dispatch({ type: "CHECKOUT_START" });

        try {
            // 模拟API调用
            await checkoutAPI(cart.items);
            dispatch({ type: "CHECKOUT_SUCCESS" });
        } catch (error) {
            dispatch({
                type: "CHECKOUT_FAILURE",
                payload: error.message,
            });
        }
    };

    return (
        <div>
            <h2>购物车</h2>

            {cart.items.length === 0 ? (
                <p>您的购物车是空的</p>
            ) : (
                <>
                    <ul>
                        {cart.items.map((item) => (
                            <li key={item.id}>
                                {item.name} - ¥{item.price} x
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateQuantity(
                                            item.id,
                                            parseInt(e.target.value)
                                        )
                                    }
                                />= ¥{item.price * item.quantity}
                                <button onClick={() => removeItem(item.id)}>
                                    删除
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <strong>总计: ¥{cart.total}</strong>
                    </div>

                    <button onClick={checkout} disabled={cart.loading}>
                        {cart.loading ? "处理中..." : "结账"}
                    </button>

                    {cart.error && <p style={{ color: "red" }}>{cart.error}</p>}
                </>
            )}

            <h3>商品列表</h3>
            <div>
                {products.map((product) => (
                    <div key={product.id}>
                        <h4>
                            {product.name} - ¥{product.price}
                        </h4>
                        <button onClick={() => addItem(product)}>
                            添加到购物车
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 示例产品数据
const products = [
    { id: 1, name: "手机", price: 2999 },
    { id: 2, name: "笔记本电脑", price: 5999 },
    { id: 3, name: "耳机", price: 999 },
];

// 模拟结账API
function checkoutAPI(items) {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            if (Math.random() > 0.2) {
                resolve({ success: true, orderId: "ORDER_" + Date.now() });
            } else {
                reject(new Error("结账失败，请稍后重试"));
            }
        }, 1500);
    });
}
```

## 与 Context 结合使用

`useReducer`经常与`useContext`结合使用，实现跨组件的状态管理：

```jsx
import React, { createContext, useContext, useReducer } from "react";

// 创建Context
const TodoContext = createContext();

// 初始状态
const initialState = {
    todos: [],
    nextId: 1,
};

// Reducer函数
function todoReducer(state, action) {
    switch (action.type) {
        case "ADD_TODO":
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: state.nextId,
                        text: action.payload,
                        completed: false,
                    },
                ],
                nextId: state.nextId + 1,
            };
        case "TOGGLE_TODO":
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            };
        case "DELETE_TODO":
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload),
            };
        default:
            return state;
    }
}

// 创建Provider组件
function TodoProvider({ children }) {
    const [state, dispatch] = useReducer(todoReducer, initialState);

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
            {children}
        </TodoContext.Provider>
    );
}

// 创建自定义Hook
function useTodo() {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error("useTodo必须在TodoProvider内使用");
    }
    return context;
}

// 主应用组件
function TodoApp() {
    return (
        <TodoProvider>
            <h1>待办事项</h1>
            <AddTodo />
            <TodoList />
        </TodoProvider>
    );
}

// 添加待办项组件
function AddTodo() {
    const [text, setText] = React.useState("");
    const { dispatch } = useTodo();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        dispatch({ type: "ADD_TODO", payload: text });
        setText("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="添加新待办..."
            />
            <button type="submit">添加</button>
        </form>
    );
}

// 待办项列表组件
function TodoList() {
    const { state, dispatch } = useTodo();

    return (
        <ul>
            {state.todos.map((todo) => (
                <li
                    key={todo.id}
                    style={{
                        textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                            dispatch({ type: "TOGGLE_TODO", payload: todo.id })
                        }
                    />
                    {todo.text}
                    <button
                        onClick={() =>
                            dispatch({ type: "DELETE_TODO", payload: todo.id })
                        }
                    >
                        删除
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

## 性能优化

### 避免重新创建 reducer 函数

在组件外定义 reducer 函数，避免每次渲染都创建新的函数实例：

```jsx
// ✅ 在组件外定义reducer
function todoReducer(state, action) {
    // reducer逻辑
}

function TodoApp() {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    // ...
}
```

### 使用 React.memo 避免不必要的渲染

当父组件重新渲染时，可以使用`React.memo`防止子组件不必要的渲染：

```jsx
const TodoItem = React.memo(function TodoItem({ todo, onToggle, onDelete }) {
    console.log(`渲染: ${todo.text}`);
    return (
        <li>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            {todo.text}
            <button onClick={() => onDelete(todo.id)}>删除</button>
        </li>
    );
});
```

### 记忆化回调函数

结合`useCallback`记忆化事件处理函数：

```jsx
function TodoList() {
    const { state, dispatch } = useTodo();

    const handleToggle = useCallback(
        (id) => {
            dispatch({ type: "TOGGLE_TODO", payload: id });
        },
        [dispatch]
    );

    const handleDelete = useCallback(
        (id) => {
            dispatch({ type: "DELETE_TODO", payload: id });
        },
        [dispatch]
    );

    return (
        <ul>
            {state.todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            ))}
        </ul>
    );
}
```

## 异步操作

`useReducer`本身不直接支持异步操作，但我们可以在组件中处理异步逻辑，然后 dispatch 相应的 action：

```jsx
function DataFetchingComponent() {
    const [state, dispatch] = useReducer(dataReducer, {
        data: null,
        loading: false,
        error: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_START" });

            try {
                const response = await fetch("https://api.example.com/data");
                const result = await response.json();

                dispatch({ type: "FETCH_SUCCESS", payload: result });
            } catch (error) {
                dispatch({ type: "FETCH_ERROR", payload: error.message });
            }
        };

        fetchData();
    }, []);

    // 渲染逻辑
}

function dataReducer(state, action) {
    switch (action.type) {
        case "FETCH_START":
            return { ...state, loading: true, error: null };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, data: action.payload };
        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}
```

## TypeScript 类型定义

在 TypeScript 中使用 useReducer，可以为状态和动作定义明确的类型：

```tsx
// 定义状态类型
interface TodoState {
    todos: Todo[];
    nextId: number;
}

// 定义待办项类型
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// 定义Action类型
type TodoAction =
    | { type: "ADD_TODO"; payload: string }
    | { type: "TOGGLE_TODO"; payload: number }
    | { type: "DELETE_TODO"; payload: number };

// 定义Reducer函数
function todoReducer(state: TodoState, action: TodoAction): TodoState {
    switch (action.type) {
        case "ADD_TODO":
            return {
                ...state,
                todos: [
                    ...state.todos,
                    {
                        id: state.nextId,
                        text: action.payload,
                        completed: false,
                    },
                ],
                nextId: state.nextId + 1,
            };
        // 其他case...
    }
}

// 在组件中使用
function TodoApp() {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    // ...
}
```

## 最佳实践

1. **合理组织 Action 和 Reducer**：对于复杂应用，可以考虑将 reducer 拆分为多个小函数，然后组合起来

```jsx
// 拆分reducer
function todosReducer(state, action) {
    switch (action.type) {
        case "ADD_TODO":
        case "TOGGLE_TODO":
        case "DELETE_TODO":
            // 处理待办项相关逻辑
            return { ...state, todos: todosStateReducer(state.todos, action) };
        default:
            return state;
    }
}

function todosStateReducer(todos, action) {
    switch (action.type) {
        case "ADD_TODO":
            return [
                ...todos,
                { id: Date.now(), text: action.payload, completed: false },
            ];
        case "TOGGLE_TODO":
            return todos.map((todo) =>
                todo.id === action.payload
                    ? { ...todo, completed: !todo.completed }
                    : todo
            );
        case "DELETE_TODO":
            return todos.filter((todo) => todo.id !== action.payload);
        default:
            return todos;
    }
}
```

2. **使用 Action Creator 函数**：创建动作对象的辅助函数

```jsx
// Action Creators
const addTodo = (text) => ({ type: "ADD_TODO", payload: text });
const toggleTodo = (id) => ({ type: "TOGGLE_TODO", payload: id });
const deleteTodo = (id) => ({ type: "DELETE_TODO", payload: id });

// 在组件中使用
function TodoActions() {
    const { dispatch } = useTodo();
    const [text, setText] = useState("");

    const handleAdd = () => {
        dispatch(addTodo(text));
        setText("");
    };

    // ...
}
```

3. **保持 Reducer 的纯净**：Reducer 应该是纯函数，不包含副作用，同样的输入总是产生同样的输出

4. **在 Reducer 中处理所有状态更新逻辑**：避免在组件中计算新状态，将所有状态计算逻辑都放在 reducer 中

5. **使用不可变方式更新状态**：避免直接修改 state 对象，始终返回新的状态对象

```jsx
// ❌ 不好的做法：直接修改状态
function badReducer(state, action) {
    switch (action.type) {
        case "ADD_TODO":
            state.todos.push({ id: Date.now(), text: action.payload });
            return state; // 这样做会导致问题！
        // ...
    }
}

// ✅ 好的做法：返回新的状态对象
function goodReducer(state, action) {
    switch (action.type) {
        case "ADD_TODO":
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { id: Date.now(), text: action.payload },
                ],
            };
        // ...
    }
}
```

## 相关概念

-   [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念和规则
-   [[02-useState|useState]] - 简单状态管理的 Hook
-   [[04-useContext|useContext]] - 可以与 useReducer 结合使用实现全局状态管理
-   Redux - useReducer 的灵感来源，提供更完整的状态管理解决方案

```

```
