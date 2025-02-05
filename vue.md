# Vue的基本原理

---

当一个Vue实例创建时，Vue会遍历data中的属性，用Object.defineProperty（Vue3.0使用proxy）将它们转为getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。每个组件实例都有相应的watcher程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新

# v-if和v-show的区别

---

+ 手段：
  + v-if是动态地向DOM树内添加或删除DOM元素
  + v-show是通过设置DOM元素的display样式属性控制显隐
+ 编译过程：
  + v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件
  + v-show只是简单的基于css切换
+ 编译条件：
  + v-if是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译
  + v-show是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且DOM元素保留
+ 性能消耗：
  + v-if有更高的切换消耗
  + v-show有更高的初始渲染消耗
+ 使用场景
  + v-if适合条件不大可能改变
  + v-show适合频繁切换

# v-model是如何实现的，语法糖实际是什么？

---

## 作用在表单元素上

动态绑定了input的value指向了message变量，并且在触发input事件的时候去动态把message设置为目标值

```html
<input v-model = "sth" />
// 等同于
<input 
	v-bind:value="message"
	v-on:input="message=$event.target.value"
>
// $event 指代当前触发的事件对象
// $event.target 指代当前触发的事件对象的dom
// $event.target.value 就是当前dom的value值
// 在@input方法中, value => sth
// 在:value中, sth => value
```

## 作用在组件上

在自定义组件中，v-model默认会利用名为value的prop和名为input的事件

**本质是一个父子组件通信的语法糖，通过prop和$.emit实现。**

在组件的实现中，可以通过v-model属性来配置子组件接收的prop名称，以及派发的事件名称

eg:

```js
// 父组件
<aa-input v-model="aa"></aa-input>
// 等价于
<aa-input v-bind:value="aa" v-on:input="onmessage"></aa-input>

// 子组件
<aa-input v-bind:value="aa" v-on:input="onmessage"></aa-input>

props:{ value:aa, }
methods:{
    onmessage(e){
        $emit('input',e.target.value)
    }
}
```

# Vue-Router的懒加载如何实现

常用：使用`箭头函数+import`动态加载

``` js
const router = new VueRouter({
    routes:[
        { path: '/list', component: () => import('@/components/list.vue')}
    ]
})
```

# 路由的hash模式和history模式（VueRouter如何实现改变url页面而不刷新的）

---

Vue-Router有两种模式：`hash模式`和`history模式`。默认的路由模式是hash模式

## hash模式

+ 简介：hash模式是开发中默认的模式，它的URL带着一个#，例如`www.abc.com/#/vue`，它的hash值就是`#/vue`

+ 特点：hash值会出现在URL里面，但是不会出现在HTTP请求中，对后端完全没有影响。所以改变hash值，不会重新加载页面。

+ 原理：hash模式的主要原理就是`onhashchange()事件`:

  ```js
  window.onhashchange = function(event){
      console.log(event.oldURL, event.newURL);
      let hash = location.hash.slice(1);
  }
  ```

  使用`onhashchange()`事件的好处就是，在页面的hash值发生变化时，无需向后端发起请求，window就可以监听事件的改变，并按照规则加载相应的代码。除此之外，hash值变化对应的URL都会被浏览器记录下来，这样浏览器就能实现页面的前进和后退。虽然没有请求后端服务器，但是页面的hash值和对应的URL关联起来了

## history模式

+ 简介：history模式的URL中没有#，它使用的是传统的路由分发模式，即用户在输入一个URL时，服务器会接受这个请求，并解析这个URL，然后做出相应的逻辑处理。
+ 特点：当使用history模式时，URL就像这样：`abc.com/user/id`。相比hash模式更加好看。但是，history模式需要后台配置支持。如果后台没有正确配置，访问时会返回404。
+ API：history api可以分为两大部分，切换历史状态和修改历史状态：
  + 修改历史状态：`pushState()`和`replaceState()`方法，这两个方法应用于浏览器的历史记录栈，提供了对历史记录进行修改的功能。只是当他们进行修改时，虽然修改了url，但浏览器不会立即向后端发送请求。**<font color='red'>如果要做到改变url但又不刷新页面的效果，就需要前端用上这两个API。</font>**
  + 切换历史状态：包括`forward()`、`back()`、`go()`三个方法，对应浏览器的前进，后退，跳转操作
+ 虽然history模式丢弃了丑陋的#，但是，它也有自己的缺点。就是在刷新页面的时候，如果没有相应的路由或资源，就会刷出404来。

## 两种模式对比

调用 history.pushState() 相比于直接修改 hash，存在以下优势:

+ pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL
+ pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中
+ pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串
+ pushState() 可额外设置 title 属性供后续使用
+ hash模式下，仅hash符号之前的url会被包含在请求中，后端如果没有做到对路由的全覆盖，也不会返回404错误；history模式下，前端的url必须和实际向后端发起请求的url一致，如果没有对用的路由处理，将返回404错误

hash模式和history模式都有各自的优势和缺陷，还是要根据实际情况选择性的使用

# Vue生命周期

---

在组合式API中，生命周期钩子有

+ `setup()`
+ `onBeforeMount()`
+ `onMounted()`
+ `onBeforeUpdate()`
+ `onUpdated()`
+ `onBeforeUnmount()`
+ `onUnmounted()`
+ `onErrorCaptured()`
+ `onRenderTracked()`
+ `onRenderTriggered()`
+ `onActivated()`
+ `onDeactivated()`
+ `onServerPrefetch()`

选项式API与组合式API中生命周期的对应的关系是：

+ `beforeCreate` 、`created` 对应 `setup()`
+ `beforeMount` 、`mounted` 对应 `onBeforeMount()` 和 `onMounted()`
+ `beforeUpdate` 、`updated` 对应 `onBeforeUpdate()` 和 `onUpdated()`
+ `beforeUnmount` 、`unmounted` 对应 `onBeforeUnmount()` 和 `onUnmounted()`
+ `errorCaptured` 对应 `onErrorCaptured()`
+ `renderTracked` 、`renderTriggered` 对应 `onRenderTracked()` 和 `onRenderTriggered()`
+ `activated` 、`deactivated` 对应 `onActivated()` 和 `onDeactivated()`
+ `serverPrefetch` 对应 `onServerPrefetch()`

# Vue的scoped原理

---

## scoped的使用

```html
<style scoped>
    .container {
        background: red;
    }
</style>
```

在`style`标签上增加`scoped`属性后，最终编译出来的结果会在选择器上增加一个唯一的`attribute`(比如`data-v-mlxsojjm`)，每个`.vue`文件编译出来的`attribute`都不一样，从而实现了**样式隔离**

```html
<style scoped>
    .container[data-v-mlxsojjm] {
        background: red;
    }
</style>
```

## .vue文件的css编译

比如.vue文件长这样：

```html
<template>
	<div class="container"></div>
</template>

<style scoped>
    .container {
        width: 100px;
        height: 100px;
        background-color: red;
    }
</style>
```

我们可以使用vue提供的解析单文件组件的编译包`@vue/compiler-sfc`，来解析我们在.vue文件中编写的css

```js
const { compileStyle } = require("@vue/compiler-sfc");
const css = `
.container {
	width: 100px;
	height: 100px;
	background-color: red;
}
`;
const { code } = compileStyle({
    source: css, // css源代码
    scoped: true, // 是否要启用scoped
    id: `data-v-${Math.random().toString(36).substring(2, 10)}`, // scoped的id
});
console.log(code);
```

编译结果如下

```css
.container[data-v-mlxsojjm] {
    width: 100px;
    height: 100px;
    background-color: red;
}
```

可以看到，带了scoped的style标签中的css，编译后会被加上一个**属性选择器**，名字以`data-v`开头，后面跟的是一个字符串，这个其实可以自定义，只要保证全局唯一就行了

template经过编译后，结果如下：

```html
<template>
	<div class="container" data-v-mlxsojjm></div> 
</template>
```

> 这就是scoped的原理了，**通过给组件中DOM元素和CSS各自都添加一个相同且唯一的属性选择器，让当前的css文件的样式只对当前组件生效**

  