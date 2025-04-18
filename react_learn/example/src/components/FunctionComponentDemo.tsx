import React from "react";

// 最简单的函数组件
function Welcome(props: { name: string }) {
    return <h1>你好, {props.name}</h1>;
}

// 使用箭头函数定义的组件
const Profile = (props: { name: string; age: number; job: string }) => {
    return (
        <div className="profile-card">
            <h2>{props.name}</h2>
            <p>年龄: {props.age}</p>
            <p>职业: {props.job}</p>
        </div>
    );
};

// 使用解构的函数组件
const ProfileWithDestructuring = ({
    name,
    age,
    job,
}: {
    name: string;
    age: number;
    job: string;
}) => {
    return (
        <div className="profile-card">
            <h2>{name}</h2>
            <p>年龄: {age}</p>
            <p>职业: {job}</p>
        </div>
    );
};

// 带默认值的函数组件
const Greeting = ({ name = "访客" }: { name?: string }) => {
    return <h1>欢迎, {name}!</h1>;
};

// 使用useState钩子的函数组件
const Counter = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div className="counter">
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>点击我</button>
        </div>
    );
};

// 父组件，组合多个函数组件
const FunctionComponentDemo = () => {
    return (
        <div className="demo-container">
            <h1>函数组件示例</h1>

            <section>
                <h2>基本函数组件</h2>
                <Welcome name="小明" />
            </section>

            <section>
                <h2>箭头函数组件</h2>
                <Profile name="张三" age={25} job="工程师" />
            </section>

            <section>
                <h2>使用解构的函数组件</h2>
                <ProfileWithDestructuring name="李四" age={30} job="设计师" />
            </section>

            <section>
                <h2>带默认值的函数组件</h2>
                <Greeting />
                <Greeting name="王五" />
            </section>

            <section>
                <h2>带状态的函数组件</h2>
                <Counter />
            </section>
        </div>
    );
};

export default FunctionComponentDemo;
