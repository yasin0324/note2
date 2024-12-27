# 为什么0.1+0.2 !== 0.3，如何让其相等

---

在开发过程中遇到类似这样的问题：

```js
let n1 = 0.1, n2 = 0.2;
console.log(n1 + n2)	// 0.30000000000000004
```

这里得到的不是想要的结果，要想等于0.3，就要把它进行转化：

```js
(n1 + n2).toFixed(2)
```

> ## 为什么会出现这样的结果？
>
> 计算机是通过二进制的方式存储数据的，所以计算机计算0.1+0.2的时候，实际上是计算的两个数的二进制的和。0.1的二进制是`0.0001100110011001100...`(1100循环)，0.2的二进制是`0.00110011001100...`(1100循环)，这两个数的二进制都是无限循环的数。
>
> ## JavaScript是如何处理无限循环的二进制小数的？
>
> 一般我们认为数字包括整数和小数，但是JavaScript中只有一种数字类型：Number，它的实现遵循IEEE 754标准，使用64位固定长度来表示，也就是标准的double双精度浮点数。在二进制科学表示法中，双精度浮点数的小数部分最多只能保留52位，再加上前面的1，其实就是保留53位有效数字，剩余的需要舍去，遵从“0舍1入”的原则。
>
> 根据这个原则，0.1和0.2的二进制数相加，再转化为十进制数就是`0.30000000000000004`

# this/call/apply/bind

---

## 对this对象的理解

this是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。

在实际开发中，this的指向可以通过四种调用模式来判断：

1. **函数调用模式**，当一个函数不是一个对象的属性时，直接作为函数来调用，this指向全局对象
2. **方法调用模式**，如果一个函数作为一个对象的方法来调用时，this指向这个对象
3. **构造器调用模式**，如果一个函数用new调用时，函数执行前会新创建一个对象，this指向这个新创建的对象
4. **apply、call和bind调用模式**，这三种方法都可以显示的指定调用函数的this指向。其中：
   + apply方法接收两个参数：一个是this绑定的对象，一个是参数数组。
   + call方法接收的参数，第一个是this绑定的对象，后面的其余参数是传入函数的执行的参数。也就是说，在使用call()方法时，传递给函数的参数必须逐个列举出来。
   + bind方法通过传入一个对象，返回一个this绑定了传入对象的新函数。这个函数的this指向除了使用new时会被改变，其他情况下不会改变。

这四种方式，使用构造器调用模式的优先级最高，然后是apply、call和bind调用模式，然后是方法调用模式，然后是函数调用模式

```js
// 1.函数调用模式
function showThis() {
    console.log(this);
}
// 在非严格模式下，输出为全局对象(window)
// 在严格模式下，输出为 undefined
showThis();

// 2.方法调用模式
const person = {
    name: 'Alice',
    greet: function() {
        console.log(this.name); // this 指向 person 对象
    }
};
person.greet(); // 输出 'Alice'

// 3.构造器调用模式
function Person(name) {
    this.name = name;
}
// 当使用new关键字调用一个构造函数时，this指向新创建的实例对象
const p = new Person('Bob');
console.log(p.name); // 输出 'Bob'

// 4 apply/call/bind
function introduce(greeting, punctuation) {
    console.log(greeting + ',' + this.name + punctuation);
}
const person1 = { name: 'Charlie' };
introduce.apply(person1, ['Hello' , '!']); // 输出 'Hello, Charlie!'
introduce.call(person1, 'Hi', '.'); // 输出 'Hi, Charlie.'
const introduceCharlie = introduce.bind(person1);
introduceCharlie('Hey', '!'); // 输出 'Hey, Charlie!'
```

## 实现call、apply及bind函数

### call函数

```js
// 判断调用对象是否为函数，即使是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
// 判断传入上下文对象是否存在，如果不存在，则设置为 window 。
// 处理传入的参数，截取第一个参数后的所有参数。
// 将函数作为上下文对象的一个属性。
// 使用上下文对象来调用这个方法，并保存返回结果。
// 删除刚才新增的属性。
// 返回结果。
Function.prototype.myCall = function (context) {
    // 判断调用对象
    if (typeof this !== "function") {
        console.error("type error");
    }
    // 获取参数
    let args = [...arguments].slice(1);
    let result = null;
    // 判断 context 是否传入，如果未传入则设置为window
    context = context || window;
    // 将调用函数设为对象的方法
    context.fn = this;
    // 调用函数
    result = context.fn(...args);
    // 将属性删除
    delete context.fn;
    return result;
};
```

### apply函数

```js
// 判断调用对象是否为函数
// 判断传入上下文对象是否存在，如果不存在，则设置为window。
// 将函数作为上下文对象的一个属性。
// 判断参数值是否传入
// 使用上下文对象来调用这个方法，并保存返回结果
// 删除刚才新增的属性
// 返回结果
Function.prototype.myApply = function (context) {
    // 判断调用对象是否为函数
    if (typeof this !== "function") {
        console.error("type error");
    }
    let result = null;
    // 判断context是否存在，如果未传入则为window
    context = context || window;
    // 将函数设为对象的方法
    context.fn = this;
    // 调用方法
    if (arguments[1]) {
        result = context.fn(...arguments[1]);
    } else {
        result = context.fn();
    }
    // 将属性删除
    delete context.fn;
    return result;
};
```

### bind函数

```js
// 判断调用对象是否为函数
// 保存当前函数的引用，获取其余传入参数值
// 创建一个函数返回
// 函数内部使用apply来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的this给apply调用，其余情况都传入指定的上下文对象
Function.prototype.myBind = function (context) {
    // 判断调用对象是否为函数
    if (typeof this !== "function") {
        console.error("type error");
    }
    // 获取参数
    let args = [...arguments].slice(1);
    let fn = this;
    return function Fn() {
        // 根据调用方式，传入不同绑定值
        return fn.apply(
            this instanceof Fn ? this : context,
            args.concat(...arguments)
        );
    };
};
```

