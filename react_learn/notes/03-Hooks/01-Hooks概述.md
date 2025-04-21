# Hooks 概述

#hooks #核心概念

Hooks 是 React 16.8 版本中引入的新特性，它让你可以在不编写类组件的情况下使用状态（state）以及其他 React 特性，如生命周期功能、上下文等。

## Hooks 的基本概念

Hooks 是一些可以让你在函数组件里"钩入"React state 及生命周期等特性的函数。Hooks 不能在类组件中使用。

## 为什么需要 Hooks？

在 React 团队引入 Hooks 之前，函数组件被称为"无状态组件"，它们不能有自己的状态或生命周期方法，这限制了它们的使用场景。为了解决这个问题，React 团队引入了 Hooks，主要解决以下问题：

1. **在组件之间复用状态逻辑很困难**  
   React 没有提供将可复用行为"附加"到组件的途径。虽然有高阶组件和 render props 等模式，但这些模式会导致组件嵌套地狱，使代码难以理解和维护。

2. **复杂组件变得难以理解**  
   在类组件中，相关的逻辑常常被分散到不同的生命周期方法中，如 componentDidMount、componentDidUpdate 等，增加了理解和维护的难度。

3. **类组件的问题**  
   类组件需要理解 JavaScript 中 this 的工作方式，在事件处理中需要手动绑定 this，而且类组件学习曲线较陡峭。

## 常用的 React Hooks

React 提供了几个内置的 Hooks：

1. **基础 Hooks**

    - [[02-useState|useState]] - 在函数组件中添加状态
    - [[03-useEffect|useEffect]] - 执行副作用操作
    - [[04-useContext|useContext]] - 订阅 React 上下文

2. **额外的 Hooks**
    - [[05-useReducer|useReducer]] - useState 的替代方案，用于处理复杂的状态逻辑
    - [[06-useCallback|useCallback]] - 返回记忆化回调函数，避免不必要的渲染
    - [[07-useMemo|useMemo]] - 返回记忆化值，提高性能
    - [[08-useRef|useRef]] - 创建可变的 ref 对象，可以持久化保存数据或访问 DOM
    - useImperativeHandle - 自定义暴露给父组件的实例值
    - useLayoutEffect - 与 useEffect 类似，但会在所有 DOM 变更后同步调用
    - useDebugValue - 在 React 开发者工具中显示自定义 hook 的标签
    - useDeferredValue - 延迟更新一个值
    - useTransition - 在不阻塞 UI 的情况下更新状态
    - useId - 生成唯一 ID

## Hooks 使用规则

使用 Hooks 有两条重要的规则：

1. **只在最顶层使用 Hooks**  
   不要在循环、条件或嵌套函数中调用 Hook。这是因为 React 依赖 Hook 的调用顺序来维护内部状态。

    ```jsx
    // ❌ 错误：条件语句中使用Hook
    if (condition) {
        useEffect(() => {
            // ...
        });
    }

    // ✅ 正确：在条件中使用的是Hook的结果
    useEffect(() => {
        if (condition) {
            // ...
        }
    });
    ```

2. **只在 React 函数中调用 Hooks**  
   不要在普通 JavaScript 函数中调用 Hook。你可以：

    - 在 React 函数组件中调用 Hooks
    - 在自定义 Hooks 中调用其他 Hooks

    ```jsx
    // 函数组件
    function MyComponent() {
        const [state, setState] = useState(initialState);
        // ...
    }

    // 自定义Hook
    function useCustomHook() {
        const [state, setState] = useState(initialState);
        // ...
        return state;
    }
    ```

## 自定义 Hooks

除了使用 React 提供的内置 Hooks，你还可以创建自己的 Hooks，即[[09-自定义Hooks|自定义Hooks]]。自定义 Hook 是一个以"use"开头的 JavaScript 函数，它可以调用其他 Hooks。

```jsx
// 自定义Hook示例
function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        function updateSize() {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener("resize", updateSize);
        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
}

// 使用自定义Hook
function MyComponent() {
    const size = useWindowSize();
    return (
        <div>
            窗口尺寸: {size.width} x {size.height}
        </div>
    );
}
```

## Hooks 与类组件的对比

Hooks 和类组件都能实现相同的功能，但在使用方式上有显著区别：

| 特性     | 类组件                                             | 函数组件+Hooks                                   |
| ------ | ----------------------------------------------- | -------------------------------------------- |
| 状态管理   | `this.state` 和 `this.setState()`                | `useState()` 和 `useReducer()`                |
| 生命周期   | `componentDidMount`, `componentDidUpdate`, etc. | `useEffect()` 和 `useLayoutEffect()`          |
| 上下文使用  | `static contextType` 或 `<Consumer>`             | `useContext()`                               |
| 引用 DOM | `React.createRef()`                             | `useRef()`                                   |
| 性能优化   | `shouldComponentUpdate`, `PureComponent`        | `React.memo()`, `useMemo()`, `useCallback()` |

## Hooks 的优势

1. **更简洁的代码**  
   Hooks 让你可以在不使用类的情况下使用 React，代码更简洁。

2. **更易于重用逻辑**  
   通过自定义 Hooks，你可以轻松地在不同组件间重用逻辑。

3. **关注点分离**  
   Hooks 让你可以按照逻辑相关性组织代码，而不是按照生命周期方法强制拆分。

4. **避免 this 指针问题**  
   函数组件中没有 this，避免了与 this 相关的常见问题。

## 何时使用 Hooks

-   **新组件开发**：对于新开发的组件，推荐使用函数组件+Hooks。
-   **重构现有组件**：对于现有的类组件，可以考虑逐步迁移到 Hooks，特别是当组件变得复杂且难以维护时。
-   **逻辑复用**：当需要在多个组件间共享逻辑时，考虑创建自定义 Hook。

## ESLint 支持

React 团队提供了 ESLint 插件`eslint-plugin-react-hooks`，用于强制执行 Hooks 规则。

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```json
// ESLint配置
{
    "plugins": ["react-hooks"],
    "rules": {
        "react-hooks/rules-of-hooks": "error", // 检查Hooks规则
        "react-hooks/exhaustive-deps": "warn" // 检查依赖项
    }
}
```

## 相关概念

-   [[02-useState]] - 状态管理 Hook
-   [[03-useEffect]] - 处理副作用 Hook
-   [[09-自定义Hooks]] - 创建自定义 Hook
-   [[../02-核心概念/02-State和生命周期/01-使用State|使用State]] - 类组件中的状态管理
-   [[../02-核心概念/02-State和生命周期/02-组件生命周期|组件生命周期]] - 类组件的生命周期方法
