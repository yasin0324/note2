# 浏览器工作原理

---

JavaScript代码，在浏览器中是如何被执行的？

输入网址后，从服务器的静态资源中得到index.html，开始解析，遇到link/script标签，下载解析对应的css/js文件

![](C:\Users\锅\Desktop\guo\八股\js学习笔记\image\PixPin_2025-02-12_08-24-56.png)

# 浏览器渲染过程

---

![PixPin_2025-02-12_08-27-22](C:\Users\锅\Desktop\guo\八股\js学习笔记\image\PixPin_2025-02-12_08-27-22.png)

HTML解析的时候遇到了JavaScript标签，会停止解析HTML，而去加载和执行JavaScript代码

> 那么，JavaScript代码由谁来执行呢？
>
> + JavaScript引擎

# JavaScript引擎

---

+ **为什么需要JavaScript引擎？**
  + 高级的编程语言都是需要转成最终的机器指令来执行的
  + 我们编写的JavaScript代码无论交给浏览器或者Node执行，最后都是需要被CPU执行的
  + 但是CPU只认识自己的指令集，实际上是机器语言，才能被CPU执行
  + 所以我们需要JavaScript引擎帮助我们将JavaScript代码翻译成CPU指令来执行
+ 比较常见的JavaScript引擎
  + SpiderMonkey：第一款JavaScript引擎，由Brendan Eich开发（JavaScript作者）
  + Chakra：微软开发，用于IE浏览器
  + JavaScriptCore：WebKit中的JavaScript引擎，Apple公司开发
  + V8：Google开发的java引擎

# V8引擎的原理

---

![PixPin_2025-02-12_08-39-32](C:\Users\锅\Desktop\guo\八股\js学习笔记\image\PixPin_2025-02-12_08-39-32.png)

官方对V8引擎的定义

+ V8是用C++编写的Google开源高性能JavaScript和WebAssembly引擎，它用于Chrome和Node.js等
+ V8可以独立运行，也可以嵌入到任何C++应用程序中

# V8引擎的架构

---

V8引擎本身的源码非常复杂，大概有超过100w行C++代码，通过了解他的架构，我们可以知道它是如何对JavaScript执行的：

+ Parse模块会将JavaScript代码转换成AST（抽象语法树），这是因为解释器并不直接认识JavaScript代码
  + 如果函数没有被调用，是不会转换成AST的
  + Parse的V8官方文档：https://v8.dev/blog/scanner
+ Ignition是一个解释器，会将AST转换成ByteCode（字节码）
  + 同时会收集TurboFn优化所需要的信息（比如函数参数的类型信息，有了类型才能进行真实的运算）
  + 如果函数只调用一次，Ignition会解释执行ByteCode
  + Ignition的V8官方文档：https://v8.dev/blog/ignition-interpreter
+ TurboFan是一个编译器，可以将字节码编译为CPU可以直接执行的机器码
  + 如果一个函数被多次调用，那么就会被标记为热点函数，那么就会经过TurboFan转换成优化的机器码，提高代码的执行性能
  + 但是，机器码实际上也会被还原为ByteCode，这是因为如果后续执行函数的过程中，类型发生了变换（比如sum函数原来执行的是number类型，后来执行变成了string类型），之前优化的机器码并不能正确地处理运算，就会逆向地转换成字节码
  + TurboFan的V8官方文档：https://v8.dev/blog/turbofan-jit

# V8执行的细节

---

![PixPin_2025-02-12_08-57-26](C:\Users\锅\Desktop\guo\八股\js学习笔记\image\PixPin_2025-02-12_08-57-26.png)

JavaScript源码是如何被解析（parse过程）的：

+ Blink将源码交给V8引擎，Stream获取到源码并且进行编码转换
+ Scanner会进行词法分析（lexical analysis），词法分析会将代码转换成tokens
+ 接下来token会被转换成AST树，经过Parser和Preparser
  + Parser就是直接将tokens转成AST树架构
  + PreParser称之为与解析，为什么需要预解析呢？
    + 这是因为并不是所有的JavaScript代码，在一开始时就会被执行，如果对所有的JavaScript代码进行解析，必然会影响网页的运行效率
    + 所以V8引擎就实现了Lazy Parsing（延迟解析）的方案，它的作用是将不必要的函数进行预解析，也就是只解析暂时需要的内容，而对函数的全量解析是在函数被调用时才会进行
+ 生成AST树后，会被Ignition转成字节码（bytecode），之后的过程就是代码的执行过程

# JavaScript的执行过程（V8）

---

## 初始化全局对象

js引擎会在执行代码之前，会在堆内存中创建一个全局对象：Global Object (GO)

+ 该对象所有的作用域(scope)都可以访问
+ 里面会包含Date、Array、String、Number、setTimeout、setInterval等等
+ 其中还有一个window属性指向自己

## 执行上下文栈（调用栈）

js引擎内部有一个执行上下文栈（Execution Context Stack，简称ECS），它是用于执行代码的调用栈

执行的是全局的代码块：

+ 全局的代码块为了执行会创建一个Global Execution Context（GEC）
+ GEC会被放入到ECS中执行

GEC被放入到ECS中里面包含两部分内容：

+ 第一部分：在代码执行前，在parser转成AST的过程中，会将全局定义的变量、函数等加入到GlobalObject中，但是不会赋值
  + 这个过程也称之为变量的作用域提升
+ 第二部分：在代码执行中，对变量赋值，或者执行其他的函数

## 遇到函数如何执行？

---

在执行的过程中执行到一个函数时，会根据函数体创建一个函数执行上下文（Functional Execution Context，简称FEC），并且压入到ECS中

FEC中包含三部分内容：

+ 第一部分：在解析函数称为AST树结构时，会创建一个Activation Object（AO）
  + AO中包含形参、arguments、函数定义和指向函数对象、定义的变量
+ 第二部分：作用域链：有VO（在函数中就是AO对象）和父级VO组成，查找时会一层层查找
+ 第三部分：this绑定的值

> 在最新的ECMA标准中，前面的变量对象VO已经有另外一个称呼了：变量环境VE