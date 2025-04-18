import React, { useState } from "react";
import "./App.css";
import FunctionComponentDemo from "./components/FunctionComponentDemo";
import ClassComponentDemo from "./components/ClassComponentDemo";
import CompositionDemo from "./components/CompositionDemo";
import StateLifecycleDemo from "./components/StateLifecycleDemo";

// 定义Todo类型
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// TodoItem组件
function TodoItem({
    todo,
    toggleTodo,
    deleteTodo,
}: {
    todo: Todo;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}) {
    return (
        <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
        </li>
    );
}

// TodoForm组件
function TodoForm({ addTodo }: { addTodo: (text: string) => void }) {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        addTodo(text);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="添加新任务..."
            />
            <button type="submit">添加</button>
        </form>
    );
}

// TodoList组件
function TodoList({
    todos,
    toggleTodo,
    deleteTodo,
}: {
    todos: Todo[];
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
}) {
    return (
        <ul className="todo-list">
            {todos.length === 0 ? (
                <p className="empty-message">恭喜，没有待办事项！</p>
            ) : (
                todos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        toggleTodo={toggleTodo}
                        deleteTodo={deleteTodo}
                    />
                ))
            )}
        </ul>
    );
}

// App组件
function App() {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: "学习React基础", completed: false },
        { id: 2, text: "学习React Hooks", completed: false },
        { id: 3, text: "构建Todo应用", completed: true },
    ]);

    // 展示组件Demo的状态
    const [demoMode, setDemoMode] = useState<
        "none" | "function" | "class" | "composition" | "state-lifecycle"
    >("none");

    // 添加Todo
    const addTodo = (text: string) => {
        const newTodo: Todo = {
            id: Date.now(),
            text,
            completed: false,
        };
        setTodos([...todos, newTodo]);
    };

    // 切换Todo状态
    const toggleTodo = (id: number) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    // 删除Todo
    const deleteTodo = (id: number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // 计算统计信息
    const completedCount = todos.filter((todo) => todo.completed).length;
    const totalCount = todos.length;

    return (
        <div className="app">
            <header className="app-header">
                <h1>React Todo 应用</h1>
                <div className="stats">
                    完成: {completedCount}/{totalCount}
                </div>
                <div className="demo-buttons">
                    <button
                        className={`demo-button ${
                            demoMode === "function" ? "active" : ""
                        }`}
                        onClick={() =>
                            setDemoMode(
                                demoMode === "function" ? "none" : "function"
                            )
                        }
                    >
                        {demoMode === "function"
                            ? "隐藏函数组件示例"
                            : "显示函数组件示例"}
                    </button>
                    <button
                        className={`demo-button ${
                            demoMode === "class" ? "active" : ""
                        }`}
                        onClick={() =>
                            setDemoMode(demoMode === "class" ? "none" : "class")
                        }
                    >
                        {demoMode === "class"
                            ? "隐藏类组件示例"
                            : "显示类组件示例"}
                    </button>
                    <button
                        className={`demo-button ${
                            demoMode === "composition" ? "active" : ""
                        }`}
                        onClick={() =>
                            setDemoMode(
                                demoMode === "composition"
                                    ? "none"
                                    : "composition"
                            )
                        }
                    >
                        {demoMode === "composition"
                            ? "隐藏组件组合示例"
                            : "显示组件组合示例"}
                    </button>
                    <button
                        className={`demo-button ${
                            demoMode === "state-lifecycle" ? "active" : ""
                        }`}
                        onClick={() =>
                            setDemoMode(
                                demoMode === "state-lifecycle"
                                    ? "none"
                                    : "state-lifecycle"
                            )
                        }
                    >
                        {demoMode === "state-lifecycle"
                            ? "隐藏State和生命周期示例"
                            : "显示State和生命周期示例"}
                    </button>
                </div>
            </header>

            <main>
                {demoMode === "function" ? (
                    <FunctionComponentDemo />
                ) : demoMode === "class" ? (
                    <ClassComponentDemo />
                ) : demoMode === "composition" ? (
                    <CompositionDemo />
                ) : demoMode === "state-lifecycle" ? (
                    <StateLifecycleDemo />
                ) : (
                    <>
                        <TodoForm addTodo={addTodo} />
                        <TodoList
                            todos={todos}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                        />
                    </>
                )}
            </main>

            <footer className="app-footer">
                <p>学习React的示例应用 - {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

export default App;
