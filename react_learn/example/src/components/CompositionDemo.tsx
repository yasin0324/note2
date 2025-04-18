import React from "react";

// 简单组件：头像
function Avatar({ user }: { user: { name: string; avatarUrl: string } }) {
    return (
        <img
            className="avatar"
            src={user.avatarUrl}
            alt={user.name}
            style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
    );
}

// 简单组件：用户名
function UserName({ user }: { user: { name: string } }) {
    return <span className="user-name">{user.name}</span>;
}

// 组合组件：用户信息
function UserInfo({ user }: { user: { name: string; avatarUrl: string } }) {
    return (
        <div
            className="user-info"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
            <Avatar user={user} />
            <UserName user={user} />
        </div>
    );
}

// 工具函数：格式化日期
function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(date);
}

// 提取后的组件：评论
function Comment({
    author,
    text,
    date,
}: {
    author: { name: string; avatarUrl: string };
    text: string;
    date: Date;
}) {
    return (
        <div
            className="comment"
            style={{
                margin: "20px 0",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "4px",
            }}
        >
            <UserInfo user={author} />
            <div className="comment-text" style={{ margin: "10px 0" }}>
                {text}
            </div>
            <div
                className="comment-date"
                style={{ fontSize: "0.8em", color: "#666" }}
            >
                {formatDate(date)}
            </div>
        </div>
    );
}

// 容器组件 - 使用children属性
function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className="card"
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                margin: "20px 0",
                overflow: "hidden",
            }}
        >
            <div
                className="card-header"
                style={{
                    padding: "10px 15px",
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #ddd",
                }}
            >
                <h3 style={{ margin: 0 }}>{title}</h3>
            </div>
            <div className="card-body" style={{ padding: "15px" }}>
                {children}
            </div>
        </div>
    );
}

// 特殊容器组件 - 使用多个具名插槽
function SplitPane({
    left,
    right,
}: {
    left: React.ReactNode;
    right: React.ReactNode;
}) {
    return (
        <div
            className="split-pane"
            style={{ display: "flex", minHeight: "200px" }}
        >
            <div
                className="split-pane-left"
                style={{
                    width: "30%",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                }}
            >
                {left}
            </div>
            <div
                className="split-pane-right"
                style={{ width: "70%", padding: "10px" }}
            >
                {right}
            </div>
        </div>
    );
}

// 菜单组件 - 用于SplitPane的左侧
function Navigation() {
    return (
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                首页
            </li>
            <li style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                产品
            </li>
            <li style={{ padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                服务
            </li>
            <li style={{ padding: "8px 0" }}>关于我们</li>
        </ul>
    );
}

// 内容组件 - 用于SplitPane的右侧
function Content() {
    return (
        <div>
            <h2>欢迎访问我们的网站</h2>
            <p>这是一个演示组件组合和提取的示例页面。</p>
            <p>React的组件化设计使构建复杂UI变得简单。</p>
        </div>
    );
}

// 主演示组件
const CompositionDemo = () => {
    // 评论数据
    const comment = {
        author: {
            name: "张三",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        text: "组件组合和提取是React中非常重要的概念，它们使我们能够构建可维护、可复用的UI系统。",
        date: new Date(),
    };

    return (
        <div className="demo-container">
            <h1>组件组合和提取示例</h1>

            <section>
                <h2>1. 组件提取示例</h2>
                <p>
                    下面的评论组件由多个小组件组合而成：Avatar, UserName,
                    UserInfo
                </p>
                <Comment
                    author={comment.author}
                    text={comment.text}
                    date={comment.date}
                />
            </section>

            <section>
                <h2>2. 使用children的组件组合</h2>
                <Card title="公告">
                    <h4>网站维护通知</h4>
                    <p>
                        本网站将于2023年10月1日进行维护升级，届时可能会出现短暂服务中断。
                    </p>
                    <button style={{ padding: "5px 10px" }}>了解更多</button>
                </Card>
            </section>

            <section>
                <h2>3. 特殊插槽的组件组合</h2>
                <SplitPane left={<Navigation />} right={<Content />} />
            </section>
        </div>
    );
};

export default CompositionDemo;
