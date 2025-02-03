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

# 箭头函数和普通函数的区别

---

## 箭头函数比普通函数更简洁

+ 如果没有参数，直接写一个空括号即可

+ 如果只有一个参数，可以省去参数的括号

+ 如果有多个参数，用逗号分隔

+ 如果函数体的返回值只有一句，可以省略大括号

+ 如果函数体不需要返回值，且只有一句话，可以给这个语句前面加一个void，最常见的就是调用一个函数

  ```js
  let fn = () => void doseNotReturn();
  ```

## 箭头函数没有自己的this

+ 箭头函数不会创建自己的this，所以它没有自己的this，它只会在自己作用域的上一层继承this。所以箭头函数中this的指向在它定义时已经确定了，之后不会改变

## 箭头函数继承来的this指向永远不会改变

```js
var id = 'GLOBAL';
var obj = {
    id: 'OBJ',
    a: function() {
        console.log(this.id);
    },
    b: () => {
        console.log(this.id);
    }
};
obj.a();	// 'OBJ'
obj.b();	// 'GLOBAL'
new obj.a()	// undefined
new obj.b()	// Uncaught TypeError: obj.b is not a constructor
```

对象obj的方法b是使用箭头函数定义的，这个函数中的this就永远指向它定义时所处的全局执行环境中的this，即使这个函数是作为对象obj的方法调用，this依旧指向Window对象

> 需要注意，定义对象的大括号`{}`是无法形成一个单独的执行环境的，它依旧是处于全局执行环境中

## call()、apply()、bind()等方法不能改变箭头函数this的指向

```js
var id = 'GLOBAL';
let fun1 = () => {
    console.log(this.id);
};
fun1();					// 'GLOBAL'
fun1.call({id: 'OBJ'});		// 'GLOBAL'
fun1.apply({id: 'OBJ'});	// 'GLOBAL'
fun1.bind({id: 'OBJ'})();	// 'GLOBAL'
```

## 箭头函数不能作为构造函数使用

构造函数在new的步骤实际上第二步就是将函数中的this指向该对象，但是由于箭头函数没有自己的this，且this指向外层的执行环境，且不能改变指向，所以不能当做构造函数使用

## 箭头函数没有自己的arguments

箭头函数没有自己的arguments对象，在箭头函数中访问arguments实际上获得的是它外层函数的arguments值

## 箭头函数没有prototype

## 箭头函数不能用作Generator函数，不能使用yeild关键字

# 箭头函数的this指向哪里

---

箭头函数不同于传统JavaScript中的函数，箭头函数并没有属于自己的this，它所谓的this是捕获其所在上下文的this值，作为自己的this值，并且由于没有属于自己的this，是不会被new调用的，这个所谓的this也不会被改变

```js
// ES6
const obj = {
    getArrow() {
        return () => {
            console.log(this === obj);
        };
    }
};

// ES5, 由 Babel 转译
var obj = {
    getArrow: function getArrow() {
        var _this = this;
        return function () {
            console.log(_this === obj);
        };
    }
};
```

