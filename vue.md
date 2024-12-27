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