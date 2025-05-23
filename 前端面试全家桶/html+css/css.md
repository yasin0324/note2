# 盒子模型的宽度如何计算？

---

## 如下代码，请问div1的offsetWidth是多大？

```html
<style>
  #div1 {
    width: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    margin: 10px;
  }
</style>

<div id="div1"></div>
```

- offsetWidth = ( 内容宽度 + 内边距 + 边框 )，无外边距
- offsetWidth = ( 100px + 10px * 2 + 1px * 2) = 122px

> 如果让offsetWidth等于100px，该如何做？
>
> ```html
> <style>
>   #div1 {
>     width: 100px;
>     padding: 10px;
>     border: 1px solid #ccc;
>     margin: 10px;
>     box-sizing: border-box;
>   }
> </style>
> 
> <div id="div1"></div>
> ```
>
> + 将box-sizing设置为border-box，width为包括内容宽度、内边距和边框的宽度

# margin纵向重叠的问题

---

## 如下代码，AAA和BBB之间的距离是多少？

```html
<style>
  p {
    font-size: 16px;
    line-height: 1;
    margin-top:	10px;
    margin-bottom: 15px;
  }
</style>

<p>AAA</p>
<p></p>
<p></p>
<p></p>
<p>BBB</p>
```

- 相邻元素的`margin-top`和`margin-bottom`会发生重叠
- 空白内容的`<p></p>`也会重叠
- **答案：15px**

# margin负值的问题

---

## 对margin的top、bottom、left、right设置负值，有何效果？

- `margin-top`和`margin-left`负值，元素向上、向左移动
- `margin-right`负值，右侧元素左移，自身不受影响
- `margin-bottom`负值，下方元素上移，自身不受影响

# BFC理解和应用

---

## 什么是BFC？如何应用？

- `Block format context`，块级格式化上下文
- 一块独立渲染区域，内部元素的渲染不会影响边界以外的元素

## 形成BFC的常见条件

- `float`不是none
- `position`是absolute或fixed
- `overflow`不是visible
- `display`是flex、inline-block等

## BFC的常见应用

- 清楚浮动

# float布局的问题，以及clearfix

---

## 如何实现圣杯布局和双飞翼布局？

### 圣杯布局和双飞翼布局的目的

- 三栏布局，中间一栏最先加载和渲染（内容最重要）
- 两侧内容固定，中间内容随着宽度自适应
- 一般用于PC网页

### 圣杯布局和双飞翼布局的技术总结

- 使用float布局
- 两侧使用margin负值，以便和中间内容横向重叠
- 防止中间内容被两侧覆盖，一个用padding，一个用margin

### 圣杯布局

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style type="text/css">
            body {
                min-width: 550px;
            }
            #header {
                text-align: center;
                background-color: #f1f1f1;
            }
            #container {
                padding-left: 200px;
                padding-right: 150px;
            }
            #container .column {
                float: left;
            }
            #center {
                background-color: #ccc;
                width: 100%;
            }
            #left {
                position: relative;
                background-color: yellow;
                width: 200px;
                right: 200px;
                margin-left: -100%;
            }
            #right {
                background-color: red;
                width: 150px;
                margin-right: -150px;
            }
            #footer {
                text-align: center;
                background-color: #f1f1f1;
            }
            .clearfix:after {
                content: "";
                display: table;
                clear: both;
            }
        </style>
    </head>
    <body>
        <div id="header">this is header</div>
        <div id="container" class="clearfix">
            <div id="center" class="column">this is center</div>
            <div id="left" class="column">this is left</div>
            <div id="right" class="column">this is right</div>
        </div>
        <div id="footer">this is footer</div>
    </body>
</html>

```

### 双飞翼布局

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style type="text/css">
            body {
                min-width: 550px;
            }
            .col {
                float: left;
            }
            #main {
                width: 100%;
                height: 200px;
                background-color: #ccc;
            }
            #main-wrap {
                margin: 0 190px;
            }
            #left {
                width: 190px;
                height: 200px;
                background-color: #0000ff;
                margin-left: -100%;
            }
            #right {
                width: 190px;
                height: 200px;
                background-color: #ff0000;
                margin-left: -190px;
            }
        </style>
    </head>
    <body>
        <div id="main" class="col">
            <div id="main-wrap">this is main</div>
        </div>
        <div id="left" class="col">this is left</div>
        <div id="right" class="col">this is right</div>
    </body>
</html>

```

## 手写clearfix

```css
.clearfix:after {
    content: "";
    display: table;
    clear: both;
}
```

# flex布局的问题

---

## flex实现一个三点的骰子

常用语法回顾：

- `flex-direction`
- `justify-content`
- `align-items`
- `flex-wrap`
- `align-self`

```css
.box {
  display: flex;
  justify-content: space-between;
}
.item {
  /* 背景色、大小、边框等 */
}
.item:nth-child(2) {
  align-self: center;
}
.item:nth-child(3) {
  align-self: flex-end;
}
```

# absolute和relative分别依据什么定位？

---

- `relative`依据自身定位
- `absolute`依据最近一层的定位元素定位

定位元素：

- `absolute` `relative` `fixed` 
- `body` 

# 居中对齐有哪些方式？

---

- 水平居中
  - inline元素：`text-align: center`
  - block元素：`margin: auto`
  - absolute元素：`left: 50%` + `margin-left负值`

- 垂直居中
  - inline元素：`line-height的值等于height值`
  - absolute元素：`top: 50%` + `margin-top负值`
  - absolute元素：`transform: translate(-50%, -50%)`
  - absolute元素：`top,left,bottom,right=0`+`margin:auto`

# line-height如何继承？

---

