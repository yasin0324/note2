# this指向什么？

---

全局作用域下：

+ 浏览器中this指向window
+ Node环境中this指向{}

但是开发中很少直接在全局作用域下去使用this，通常是在函数中使用

+ 所有的函数在被调用时，都会创建一个执行上下文
+ 这个上下文中记录着函数的调用栈、AO对象等
+ this也是其中的一条记录

# this到底指向什么？

---

先来看一个案例：

```js
// 定义一个函数
function foo() {
    console.log(this);
}

// 1.直接调用
foo();	// window

// 2.将foo放到一个对象中，再调用
var obj = {
    name: "yasin",
    foo: foo
}
obj.foo()	// obj对象

// 3.通过call/apply调用
foo.call("abc")	// String {"abc"}对象
```

可以看到，定义一个函数，采用不同的方式对它进行调用，会产生不同的结果

> 案例中可以获得的启示：
>
> 1. 函数在调用时，JavaScript会默认给this绑定一个值
> 2. this的绑定和**定义的位置没有关系**
> 3. this的绑定和**调用方式以及调用的位置有关**
> 4. this是在运行时被绑定的

## 默认绑定

什么情况下使用默认绑定？独立函数调用，独立的函数调用我们可以理解成函数没有被绑定到某个对象上进行调用

```js
// 默认绑定：独立函数调用
// 案例一
function foo() {
    console.log(this);
}

foo()	// window

// ------------------------------
// 案例二
function foo1() {
    console.log(this);
}

function foo2() {
    console.log(this);
    foo1();
}

function foo3() {
    console.log(this);
    foo2();
}

foo3();
// window
// window
// window

// ------------------------------
// 案例三
var obj = {
    name: "yasin",
    foo: function() {
        console.log(this);
    }
}

var bar = obj.foo;
bar()	// window

// ------------------------------
// 案例四
function foo() {
    console.log(this);
}
var obj = {
    name: "yasin",
    foo: foo
}

var bar = obj.foo;
bar()	// window

// ------------------------------
// 案例五
function foo() {
    function bar() {
        console.log(this);
    }
    return bar;
}

var fn = foo();
fn();	// window
```

## 隐式绑定

另外一种较常见的调用方式是通过某个对象进行调用的，也就是它的调用位置中，是通过某个对象发起的函数调用

```js
// 隐式绑定：object.fn()
// object对象会被js引擎绑定到fn函数中的this里面
function foo() {
    console.log(this);
}

// 案例一
var obj = {
    name: "yasin",
    foo: foo
}

obj.foo();	// obj对象

// ------------------------------
// 案例二
var obj = {
    name: "yasin",
    eating: function() {
        console.log(this.name + "is eating");
    },
    running: function() {
        console.log(this.name + "is running");
    }
}

obj.eating();	// "yasin is eating"
obj.running();	// "yasin is running"

// ------------------------------
// 案例三
var obj1 = {
    name: "obj1",
    foo: function() {
        console.log(this.name);
    }
}

var obj2 = {
    name: "obj2",
    bar: obj1.foo
}

obj2.bar();	// obj2
```

## 显式绑定

---

隐式绑定有一个前提条件：

+ 必须在调用的对象内部有一个对函数的引用（比如一个属性）
+ 如果没有这样的引用，在进行调用时，会报找不到该函数的错误
+ 正是通过这个引用，间接地将this绑定到了这个对象上

如果我们不希望在**对象内部**包含这个函数的引用，同时又希望在这个对象上进行强制调用，该怎么做呢？

+ JavaScript所有的函数都可以使用call和apply方法

  ```js
  function foo() {
      console.log(this);
  }
  var obj = {
      name: "obj"
  }
  
  foo();	// window
  foo.call(obj);	// window
  foo.apply(obj);	// window
  // foo直接调用和call/apply调用的不同在于this绑定的不同
  // foo直接调用指向的是全局对象（window）
  // call/apply是可以指定this的绑定对象
  
  function sum(num1, num2, num3) {
      console.log(num1 + num2 + num3, this);
  }
  sum.call("call", 20, 30, 40)	// 90, "call"
  sum.apply("apply", [20, 30, 40])	// 90, "apply"
  // call和apply的区别在于传参的形式不同，call和apply的第一个参数都是需要绑定的对象，后面的参数，call为参数列表，apply为数组
  ```

+ 在调用这个函数时，会将this绑定到这个传入的对象上

+ 如果我们希望一个函数总是显示地绑定到一个对象上， 可以使用bind

  ```js
  function foo() {
      console.log(this);
  }
  
  var obj = {
      name: "yasin"
  }
  
  var bar = foo.bind(obj);
  
  bar();	// obj对象
  // 默认绑定和显式绑定冲突，优先级：显式绑定 > 默认绑定
  ```

因为上面的过程，明确绑定了this指向的对象，所以称之为显式绑定

## new 绑定

JavaScript中的函数可以当做一个类的构造函数来使用，也就是使用new关键字

使用new关键字来调用对象时，会执行如下的操作：

+ 创建一个全新的对象
+ 这个新对象会被执行prototype连接
+ 这个新对象会绑定到函数调用的this上
+ 如果函数没有返回其他对象，表达式会返回这个新对象

```js
// 通过一个new关键字调用一个函数时（构造器），这个时候this是在调用这个构造器时创建出来的对象
// this = 创建出来的对象
// 这个绑定过程就是new绑定
function Persion(name) {
    console.log(this);	// Person {}
    this.name = name;
}

var p1 = new Person("yasin")
console.log(p1.name);	// yasin

var p2 = new Person("sakura")
console.log(p2.name);	// sakura
```

## 规则优先级

1. 默认绑定优先级最低
2. 显式绑定优先级高于隐式绑定
3. new绑定优先级高于隐式绑定
4. new绑定优先级高于bind
   + new绑定和call/apply不能一起使用

# 一些函数的this分析

---

有些时候，我们会调用一些JavaScript的内置函数，或者一些第三方库中的内置函数，这些内置函数会要求我们传入另外一个函数，我们自己并不会显式地调用这些函数，JavaScript内部或者第三方库内部会帮助我们执行，这些函数中的this是如何绑定的？

## setTimeout

```js
setTimeout(function () {
    console.log(this);	// window
}, 1000);
```

## 监听点击

```js
const boxDiv = document.querySelect(".box");
boxDiv.onclick = function() {
    console.log(this);	// boxDiv对象
}
```

## 数组的forEach(/map/filter/find)

```js
var names = ["abc", "cba", "nba"];
names.forEach(function(item) {
    console.log(this);	// window
})

var obj = { name: "yasin" };
names.forEach(function(item) {
    console.log(this);	// obj对象
}, obj)
```

# 箭头函数

---

箭头函数是ES6之后增加的一种编写函数的方法，它比函数表达式更简洁

箭头函数有以下特性：

+ 箭头函数不会创建自己的this绑定。它们会从定义时的上下文中捕获this的值。这使得箭头函数在事件处理程序、回调函数等场景中非常方便
+ 箭头函数不能作为构造函数使用。因此，不能使用new关键字来调用箭头函数
+ 箭头函数没有arguments对象。如果需要使用类似arguments等功能，可以使用ES6中的剩余参数语法
+ 箭头函数没有prototype属性。因为它们不能作为构造函数使用，所以也不需要prototype属性

> 编写优化：
>
> + 如果只有一个参数 ()可以省略
>
>   ```js
>   nums.forEach(item => {});
>   ```
>
> + 如果函数执行体中只有一行代码，{}可以省略
>
>   ```js
>   nums.forEach(item => console.log(item));
>   nums.filter(item => true);
>   ```
>
> + 如果函数执行体只有一个返回对象，那么需要给这个对象加上()
>
>   ```js
>   var foo = () => {
>     return { name: "abc" }
>   };
>   
>   var bar = () => ({name: "abc"});
>   ```

## this指向

箭头函数不使用this的四种标准规则（也就是不绑定this），而是根据外层作用域来决定this

 ```js
 // 应用场景
 var obj = {
   data: [],
   getData: function() {
     // 模拟发送网络请求，将拿到的数据放入data
     
     // 箭头函数之前的解决办法
     var _this = this;
     setTimeout(function() {
       var res = ["abc", "def"];
       _this.data.push(...res);
     }, 1000)
     
     // 使用箭头函数
     setTimeout(() => {
       var res = ["abc", "def"];
       this.data.push(...res);
     }, 1000)
   }
 }; 
 ```

# 面试题

---

> 注释即为this指向

 ```js
 // 1
 var name = "window";
 
 var person = {
   name: "person",
   sayName: function() {
     console.log(this.name);
   }
 };
 
 function sayName() {
   var sss = person.sayName;
   sss();	// window：默认绑定 独立函数调用
   person.sayName();	// person：隐式绑定
   (person.sayName)();	// person：隐式绑定
   (b = person.sayName)();	// window：赋值表达式，实质是独立函数调用 默认绑定
 }
 
 sayName();
 ```

```js
// 2
var name = "window";

var person1 = {
  name: "person1",
  foo1: function () {
    console.log(this.name);
  },
  foo2: () => console.log(this.name),
  foo3: function () {
    return function () {
      console.log(this.name);
    }
  },
  foo4: function () {
    return () => {
      console.log(this.name);
    }
  }
};

var person2 = { name: "person2" };

person1.foo1();	// person1：隐式绑定
person1.foo1.call(person2);	// person2:显式绑定 优先级高于隐式绑定

person1.foo2();	// window：上层作用域
person1.foo2.call(person2);	// window：上层作用域

person1.foo3()();	// window：默认绑定
person1.foo3.call(person2)();	// window：默认绑定
person1.foo3().call(person2);	// person2:显式绑定

person1.foo4()();	// person1
person1.foo4.call(person2)();	// person2
person1.foo4().call(person2);	// person1
```

```js
var name = "window";

function Person(name) {
  this.name = name;
  this.foo1 = function () {
    console.log(this.name);
  };
  this.foo2 = () => console.log(this.name);
  this.foo3 = function () {
    return function () {
      console.log(this.name);
    }
  };
  this.foo4 = function () {
    return () => {
      console.log(this.name);
    }
  }
};

var person1 = new Person('person1');
var person2 = new Person('person2');

person1.foo1();	// person1
person1.foo1.call(person2);	// person2

person1.foo2();	// person1
person1.foo2.call(person2);	// person1

person1.foo3()();	// window
person1.foo3.call(person2)();	// window
person1.foo3().call(person2);	// person2

person1.foo4()(); // person1
person1.foo4.call(person2)();	// person2
person1.foo4().call(person2);	// person1
```

```js
var name = "window";

function Person(name) {
  this.name = name;
  this.obj = {
    name: "obj",
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  };
};

var person1 = new Person("person1");
var person2 = new Person("person2");

person1.obj.foo1()();	// window
person1.obj.foo1.call(person2)();	// window
person1.obj.foo1().call(person2);	// person2

person1.obj.foo2()();	// obj
person1.obj.foo2.call(person2)();	// person2 
person1.obj.foo2().call(person2);	// obj
```

