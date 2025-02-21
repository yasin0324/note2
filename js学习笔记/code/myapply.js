Function.prototype.myapply = function (thisArg, argArray) {
    // 1.获取被执行函数
    var fn = this;

    // 2.处理绑定的thisArg
    thisArg =
        thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;

    // 3.执行函数
    thisArg.fn = fn;
    if (!argArray) {
        thisArg.fn();
    } else {
        var res = thisArg.fn(...argArray);
    }
    delete thisArg.fn;

    // 4.返回最终结果
    return res;
};
