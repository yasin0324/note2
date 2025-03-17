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

+ offsetWidth = ( 内容宽度 + 内边距 + 边框 )，无外边距
+ offsetWidth = ( 100px + 10px * 2 + 1px * 2) = 122px

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



# margin负值的问题

---

## 对margin的top、bottom、left、right设置负值，有何效果？



# BFC理解和应用

---

## 什么是BFC？如何应用？

# float布局的问题，以及clearfix

---

## 如何实现圣杯布局和双飞翼布局？



## 手写clearfix

# flex布局的问题

---

## flex实现一个三点的骰子