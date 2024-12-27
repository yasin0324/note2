// 函数防抖是指在事件被触发n秒后再执行回调，如果在这n秒内事件又被触发，则重新计时。这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求
// 实现思路
// 1.函数只能在事件停止触发指定时间后执行
// 2.如果在指定的时间内再次触发，之前的定时器应该被清除并重新计时
// 3.正确处理this和传递参数
function debounce(func, delay) {
    let timeout;

    return function (...args) {
        // 清除上一次的定时器
        if (timeout) {
            clearTimeout(timeout);
        }

        // 设置新的定时器
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 测试防抖函数执行的时机
let count = 0;
function logMessage() {
    count++;
    console.log(`Executed: ${count}`);
}

// 创建防抖函数，500ms 后执行
const debouncedLog = debounce(logMessage, 500);

// 模拟快速触发事件（比如用户快速输入）
debouncedLog();
debouncedLog();
debouncedLog();

// 500ms 后，应该只输出 "Executed: 1"，即防抖生效
setTimeout(() => {
    console.log("After 500ms");
}, 600);

// 测试防抖函数的参数传递
function greet(name) {
    console.log(`Hello, ${name}!`);
}

const debouncedGreet = debounce(greet, 300);

// 测试防抖函数传递参数
debouncedGreet("Alice");
debouncedGreet("Bob");
debouncedGreet("Charlie");

// 300ms 后，应该输出 "Hello, Charlie!"（最后一次触发的参数）
setTimeout(() => {
    console.log("After 300ms");
}, 400);

//   测试 this 指向
function Counter() {
    this.count = 0;
    this.increment = debounce(function () {
        this.count++;
        console.log(this.count);
    }, 300);
}

const counter = new Counter();
counter.increment();
counter.increment();
counter.increment();

// 300ms 后，应该输出 "1"（只有最后一次调用才会执行）
setTimeout(() => {
    console.log("After 300ms");
}, 400);
