import React, { Component } from "react";

// 最简单的类组件
class Welcome extends Component<{ name: string }> {
    render() {
        return <h1>你好, {this.props.name}</h1>;
    }
}

// 带状态的类组件
class Counter extends Component<{}, { count: number }> {
    constructor(props: {}) {
        super(props);
        this.state = { count: 0 };
        // 绑定方法
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({ count: this.state.count + 1 });
    }

    render() {
        return (
            <div className="counter">
                <p>你点击了 {this.state.count} 次</p>
                <button onClick={this.handleClick}>点击我</button>
            </div>
        );
    }
}

// 使用类属性和箭头函数简化的计数器
class CounterSimplified extends Component<{}, { count: number }> {
    // 使用类属性初始化状态，无需构造函数
    state = { count: 0 };

    // 使用箭头函数自动绑定this
    handleClick = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return (
            <div className="counter">
                <p>你点击了 {this.state.count} 次</p>
                <button onClick={this.handleClick}>点击我</button>
            </div>
        );
    }
}

// 带默认Props的类组件
class Greeting extends Component<{ name?: string }> {
    static defaultProps = {
        name: "访客",
    };

    render() {
        return <h1>欢迎, {this.props.name}!</h1>;
    }
}

// 生命周期演示组件
class LifecycleDemo extends Component<{}, { date: Date }> {
    timerID: NodeJS.Timeout | null = null;

    constructor(props: {}) {
        super(props);
        this.state = { date: new Date() };
        console.log("1. 构造函数执行");
    }

    componentDidMount() {
        console.log("3. 组件已挂载");
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentDidUpdate() {
        console.log("4. 组件已更新");
    }

    componentWillUnmount() {
        console.log("5. 组件将卸载");
        if (this.timerID) {
            clearInterval(this.timerID);
        }
    }

    tick() {
        this.setState({ date: new Date() });
    }

    render() {
        console.log("2. 渲染方法执行");
        return (
            <div className="clock">
                <h3>当前时间：{this.state.date.toLocaleTimeString()}</h3>
                <p>查看控制台了解生命周期执行顺序</p>
            </div>
        );
    }
}

// 父组件，展示所有类组件示例
class ClassComponentDemo extends Component {
    render() {
        return (
            <div className="demo-container">
                <h1>类组件示例</h1>

                <section>
                    <h2>基本类组件</h2>
                    <Welcome name="小明" />
                </section>

                <section>
                    <h2>带状态的类组件(构造函数初始化)</h2>
                    <Counter />
                </section>

                <section>
                    <h2>带状态的类组件(类属性简化)</h2>
                    <CounterSimplified />
                </section>

                <section>
                    <h2>带默认Props的类组件</h2>
                    <Greeting />
                    <Greeting name="王五" />
                </section>

                <section>
                    <h2>生命周期演示</h2>
                    <LifecycleDemo />
                </section>
            </div>
        );
    }
}

export default ClassComponentDemo;
