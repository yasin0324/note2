# Hooks

React Hooks 是 React 16.8 引入的新特性，它允许函数组件使用状态和其他 React 特性，这些特性以前只能在类组件中使用。本目录详细介绍 React Hooks 的概念和使用方法。

## 内容概述

1. [[01-Hooks概述|Hooks概述]] - Hooks 的基本概念、规则和作用
2. [[02-useState|useState]] - 在函数组件中使用状态
3. [[03-useEffect|useEffect]] - 处理副作用
4. [[04-useContext|useContext]] - 使用 Context 共享数据
5. [[05-useReducer|useReducer]] - 复杂状态管理
6. [[06-useCallback|useCallback]] - 记忆化回调函数
7. [[07-useMemo|useMemo]] - 记忆化计算结果
8. [[08-useRef|useRef]] - 引用 DOM 和保存值
9. [[09-自定义Hooks|自定义Hooks]] - 创建可复用的 Hooks

## Hooks 解决什么问题？

React Hooks 解决了以下几个主要问题：

1. **复用状态逻辑**：在 Hooks 之前，复用状态逻辑需要使用高阶组件或渲染道具等模式，这会导致组件嵌套过深。Hooks 允许在不添加组件的情况下复用状态逻辑。

2. **复杂组件难以理解**：类组件中，相关逻辑常常分散在不同的生命周期方法中。Hooks 允许按逻辑关注点组织代码，而不是生命周期方法。

3. **类组件复杂性**：类组件需要理解 JavaScript 中 `this` 的工作方式，绑定事件处理器，以及处理复杂的生命周期方法。Hooks 让函数组件能做到同样的事情，但更简单直观。

## 学习重点

-   Hooks 的使用规则
-   内置 Hooks 的用途和用法
-   如何组合使用多个 Hooks
-   如何创建自定义 Hooks
-   Hooks 与类组件的对比
-   Hooks 的性能优化

## 后续学习

掌握了 Hooks 后，你可以继续学习 React 的高级特性，如 [[../04-高级特性/README.md|上下文 (Context)]]、[[../04-高级特性/README.md|错误边界]] 等内容。
