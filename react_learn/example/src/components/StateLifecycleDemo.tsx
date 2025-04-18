import React, { Component, useState, useEffect } from "react";
import "./StateLifecycleDemo.css";

// 类组件中的State示例
class ClassCounter extends Component<{}, { count: number }> {
    constructor(props: {}) {
        super(props);
        this.state = { count: 0 };
        console.log("ClassCounter: constructor执行");
    }

    componentDidMount() {
        console.log("ClassCounter: componentDidMount执行");
        document.title = `点击了 ${this.state.count} 次`;
    }

    componentDidUpdate() {
        console.log("ClassCounter: componentDidUpdate执行");
        document.title = `点击了 ${this.state.count} 次`;
    }

    componentWillUnmount() {
        console.log("ClassCounter: componentWillUnmount执行");
        document.title = "计数器已卸载";
    }

    handleIncrement = () => {
        // 直接使用当前state值更新
        this.setState({ count: this.state.count + 1 });
    };

    handleMultipleIncrements = () => {
        // 错误方式 - 由于setState的异步性，这样写不会+3
        this.setState({ count: this.state.count + 1 });
        this.setState({ count: this.state.count + 1 });
        this.setState({ count: this.state.count + 1 });

        // 正确方式 - 使用函数式更新
        // this.setState(prevState => ({ count: prevState.count + 1 }));
        // this.setState(prevState => ({ count: prevState.count + 1 }));
        // this.setState(prevState => ({ count: prevState.count + 1 }));
    };

    render() {
        console.log("ClassCounter: render执行");
        return (
            <div className="counter-box">
                <h3>类组件中的计数器</h3>
                <p>当前计数: {this.state.count}</p>
                <button onClick={this.handleIncrement}>增加</button>
                <button onClick={this.handleMultipleIncrements}>
                    尝试增加三次
                </button>
            </div>
        );
    }
}

// 函数组件中使用useState和useEffect
function HookCounter() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    // 相当于componentDidMount和componentDidUpdate
    useEffect(() => {
        console.log("HookCounter: count变化或组件挂载时执行");
        document.title = `点击了 ${count} 次`;

        // 返回清理函数，相当于componentWillUnmount
        return () => {
            console.log("HookCounter: 清理函数执行");
            document.title = "计数器已卸载";
        };
    }, [count]); // 仅当count变化时执行

    // 这个useEffect仅在挂载和卸载时执行
    useEffect(() => {
        console.log("HookCounter: 组件挂载时执行");

        return () => {
            console.log("HookCounter: 组件卸载时执行");
        };
    }, []);

    // 每次渲染都会执行
    useEffect(() => {
        console.log("HookCounter: 每次渲染都执行");
    });

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleMultipleIncrements = () => {
        // 错误方式 - 由于setState的异步性，这样写不会+3
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);

        // 正确方式 - 使用函数式更新
        // setCount(prevCount => prevCount + 1);
        // setCount(prevCount => prevCount + 1);
        // setCount(prevCount => prevCount + 1);
    };

    return (
        <div className="counter-box">
            <h3>函数组件中的计数器</h3>
            <p>当前计数: {count}</p>
            <button onClick={handleIncrement}>增加</button>
            <button onClick={handleMultipleIncrements}>尝试增加三次</button>

            <div className="input-demo">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="修改此文本不会触发count的副作用"
                />
                <p>输入文本: {text}</p>
            </div>
        </div>
    );
}

// 演示对象形式的State
class UserProfile extends Component<
    {},
    { user: { name: string; age: number; hobby: string } }
> {
    constructor(props: {}) {
        super(props);
        this.state = {
            user: {
                name: "张三",
                age: 25,
                hobby: "阅读",
            },
        };
    }

    // 错误的状态更新方式 - 直接修改state
    wrongUpdate = () => {
        // 直接修改state不会触发重新渲染
        this.state.user.age += 1;
        console.log("年龄已更新为:", this.state.user.age); // 值确实改变了
        // 但组件不会重新渲染
    };

    // 正确的状态更新方式 - 创建新对象
    correctUpdate = () => {
        this.setState({
            user: {
                ...this.state.user, // 保留其他字段
                age: this.state.user.age + 1,
            },
        });
    };

    render() {
        return (
            <div className="user-profile">
                <h3>用户资料</h3>
                <p>姓名: {this.state.user.name}</p>
                <p>年龄: {this.state.user.age}</p>
                <p>爱好: {this.state.user.hobby}</p>
                <button onClick={this.wrongUpdate}>错误方式增加年龄</button>
                <button onClick={this.correctUpdate}>正确方式增加年龄</button>
            </div>
        );
    }
}

// 类组件的完整生命周期演示
class LifecycleDemo extends Component<{ name: string }, { count: number }> {
    constructor(props: { name: string }) {
        super(props);
        this.state = { count: 0 };
        console.log("1. 构造函数执行");
    }

    static getDerivedStateFromProps(
        nextProps: { name: string },
        prevState: { count: number }
    ) {
        console.log("2. getDerivedStateFromProps执行");
        console.log("  nextProps:", nextProps);
        console.log("  prevState:", prevState);
        return null; // 返回null表示不更新state
    }

    componentDidMount() {
        console.log("4. componentDidMount执行");
    }

    shouldComponentUpdate(
        nextProps: { name: string },
        nextState: { count: number }
    ) {
        console.log("5. shouldComponentUpdate执行");
        console.log("  nextProps:", nextProps);
        console.log("  nextState:", nextState);
        return true; // 返回true表示组件应该更新
    }

    getSnapshotBeforeUpdate(
        prevProps: { name: string },
        prevState: { count: number }
    ) {
        console.log("7. getSnapshotBeforeUpdate执行");
        console.log("  prevProps:", prevProps);
        console.log("  prevState:", prevState);
        return { message: "从getSnapshotBeforeUpdate返回的数据" };
    }

    componentDidUpdate(
        prevProps: { name: string },
        prevState: { count: number },
        snapshot: any
    ) {
        console.log("8. componentDidUpdate执行");
        console.log("  prevProps:", prevProps);
        console.log("  prevState:", prevState);
        console.log("  snapshot:", snapshot);
    }

    componentWillUnmount() {
        console.log("9. componentWillUnmount执行");
    }

    handleClick = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        console.log("3/6. render执行");
        return (
            <div className="lifecycle-demo">
                <h3>生命周期演示</h3>
                <p>组件名称: {this.props.name}</p>
                <p>计数: {this.state.count}</p>
                <button onClick={this.handleClick}>增加计数（触发更新）</button>
                <p>查看控制台了解各生命周期方法的执行顺序</p>
            </div>
        );
    }
}

// 主演示组件
class StateLifecycleDemo extends Component<
    {},
    { showClassCounter: boolean; showHookCounter: boolean; name: string }
> {
    state = {
        showClassCounter: true,
        showHookCounter: true,
        name: "LifecycleComponent",
    };

    toggleClassCounter = () => {
        this.setState((prevState) => ({
            showClassCounter: !prevState.showClassCounter,
        }));
    };

    toggleHookCounter = () => {
        this.setState((prevState) => ({
            showHookCounter: !prevState.showHookCounter,
        }));
    };

    changeName = () => {
        this.setState({
            name: "更新后的" + Math.floor(Math.random() * 100),
        });
    };

    render() {
        return (
            <div className="demo-container">
                <h1>State和生命周期示例</h1>

                <section>
                    <h2>状态管理</h2>
                    <div className="counter-container">
                        <div className="counter-controls">
                            <button onClick={this.toggleClassCounter}>
                                {this.state.showClassCounter
                                    ? "卸载类组件"
                                    : "挂载类组件"}
                            </button>
                            {this.state.showClassCounter && <ClassCounter />}
                        </div>

                        <div className="counter-controls">
                            <button onClick={this.toggleHookCounter}>
                                {this.state.showHookCounter
                                    ? "卸载函数组件"
                                    : "挂载函数组件"}
                            </button>
                            {this.state.showHookCounter && <HookCounter />}
                        </div>
                    </div>
                </section>

                <section>
                    <h2>对象形式的状态更新</h2>
                    <UserProfile />
                </section>

                <section>
                    <h2>完整生命周期演示</h2>
                    <button onClick={this.changeName}>修改名称属性</button>
                    <LifecycleDemo name={this.state.name} />
                    <p className="note">
                        在组件挂载、更新和卸载各阶段，
                        <br />
                        不同生命周期方法会在控制台输出日志
                    </p>
                </section>
            </div>
        );
    }
}

export default StateLifecycleDemo;
