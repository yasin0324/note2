Function.prototype.mybind = function (thisArg, ...bindArgs) {
    // 1.获取被执行函数
    var fn = this;

    // 2.处理绑定的thisArg
    thisArg =
        thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;

    // 3.执行函数，返回结果
    thisArg.fn = fn;
    return function (...newArgs) {
        var args = [...bindArgs, ...newArgs];
        return thisArg.fn(...args);
    };
};

function sum() {
    console.log(this);
}

var sum2 = sum.mybind("abc");
sum2();
