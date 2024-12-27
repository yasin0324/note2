// 函数节流是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。流常用于处理滚动事件、窗口大小变化等高频事件，避免函数在短时间内频繁执行。

// 不带延迟执行的节流
function throttle1(fn, delay) {
    let lastTime = 0;

    return function (...args) {
        const now = Date.now();
        const remainingTime = delay - (now - lastTime);

        // 如果当前时间距离上次执行的事件间隔超过了'delay'，则执行函数
        if (remainingTime <= 0) {
            fn.apply(context, args);
            lastTime = now; // 更新上次执行时间
        }
    };
}

// 带延迟执行的节流（如果事件触发频繁，在delay毫秒后执行最后一次触发的事件）
function throttle2(fn, delay) {
    let lastTime = 0;

    return function (...args) {
        let now = Date.now();
        let remainingTime = delay - (now - lastTime);

        if (remainingTime <= 0) {
            // 如果间隔时间已过，立即执行
            fn.apply(this, args);
            lastTime = now; // 更新上次执行时间
        } else {
            // 否则，等待剩余的时间后再执行
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                fn.apply(this, args);
                lastTime = Date.now();
            }, remainingTime);
        }
    };
}
