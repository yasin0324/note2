# React 学习提问模板

使用以下模板向 AI 助手提问，可以获得更有针对性的帮助：

## 概念解释类问题

```
请扮演React导师角色，详细解释[概念名称]的含义、使用场景和最佳实践。请举例说明，并提供相关的代码示例。
```

示例：

```
请扮演React导师角色，详细解释React中"受控组件"的含义、使用场景和最佳实践。请举例说明，并提供相关的代码示例。
```

## 代码分析类问题

```
请分析以下React代码，解释它的工作原理，指出其中可能存在的问题或改进空间：

[粘贴代码]
```

示例：

```
请分析以下React代码，解释它的工作原理，指出其中可能存在的问题或改进空间：

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>增加</button>
    </div>
  );
}
```

## 实践引导类问题

```
我想实现一个[功能描述]的React组件。请指导我如何一步步实现，包括组件结构、状态管理和样式设计。
```

示例：

```
我想实现一个可以展开/收起详细信息的手风琴(Accordion)React组件。请指导我如何一步步实现，包括组件结构、状态管理和样式设计。
```

## 错误调试类问题

```
在我的React应用中遇到了以下错误：

[错误信息]

我的代码如下：

[相关代码]

请帮我分析可能的原因和解决方案。
```

示例：

```
在我的React应用中遇到了以下错误：

Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.

我的代码如下：

function Button() {
  const [clicked, setClicked] = useState(false);

  return (
    <button onClick={setClicked(true)}>
      {clicked ? '已点击' : '点击我'}
    </button>
  );
}

请帮我分析可能的原因和解决方案。
```

## 学习规划类问题

```
我目前已经了解了[已学内容]，接下来想学习[目标内容]。请为我制定一个循序渐进的学习计划，包括学习资源推荐。
```

示例：

```
我目前已经了解了React基础、组件、Props和State，接下来想学习React Router和状态管理。请为我制定一个循序渐进的学习计划，包括学习资源推荐。
```

## 对比分析类问题

```
请对比分析React中的[概念A]和[概念B]，包括它们的异同点、适用场景和使用建议。
```

示例：

```
请对比分析React中的函数组件和类组件，包括它们的异同点、适用场景和使用建议。
```

---

使用上述模板提问时，请尽可能提供具体的信息和上下文，这样 AI 助手能够提供更有针对性的帮助。
