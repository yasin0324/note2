Function.prototype.mycall = function (thisArg, ...args) {
    // 1.获取被执行函数
    var fn = this;

    // 2.将thisArg转成对象类型（防止传入的是非对象类型）
    thisArg =
        thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;

    // 3.调用需要被执行的函数
    thisArg.fn = fn;
    var res = thisArg.fn(...args);
    delete thisArg.fn;

    // 4.将最终的结果返回出去
    return res;
};

function sum(num1, num2) {
    console.log(num1 + num2, this);
    return num1 + num2;
}

var obj1 = {
    name: "obj1",
};

var obj2 = {
    name: "obj2",
};

// let a = sum.call(obj1, 10, 20);
let a = sum.mycall(null, 10, 20);
console.log(a);
