# call

---

```js
Function.prototype.mycall = function(thisArg, ...args) {
  // 1.获取被执行函数
  var fn = this;
  
  // 2.将thisArg转成对象类型（防止传入的是非对象类型）
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg) : window;
  
  // 3.调用需要被执行的函数
  thisArg.fn = fn;
  var res = thisArg.fn(...args);
  delete thisArg.fn;
  
  // 4.将最终的结果返回
  return res;
}
```

# apply

---

```js
Function.prototype.myapply = function(thisArg, argArray) {
  // 1.获取被执行函数
  var fn = this;
  
  // 2.处理绑定的thisArg
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg) : window;
  
  // 3.执行函数
  thisArg.fn = fn;
  if (!argArray) {
    thisArg.fn();
  } else {
    var res = thisArg.fn(...argArray);
  }
  delete thisArg.fn;
  
  return res;
}
```

# bind

---

```js
Function.prototype.mybind = function(thisArg, ...bindArgs) {
  // 1.获取被执行函数
  var fn = this;
  
  // 2.处理绑定的thisArg
  thisArg = (thisArg !== null && thisArg !== undefined) ? Object(thisArg) : window;
  
  // 3.执行函数，返回结果
  thisArg.fn = fn;
  return function(...newArgs) {
    var args = [...bindArgs, ...newArgs];
    return thisArg.fn(...args);
  }
}
```

