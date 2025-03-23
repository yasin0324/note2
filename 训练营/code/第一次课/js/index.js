// 获取所有导航链接
const navLinks = document.querySelectorAll(".nav-links div span");

// 记录当前active的元素
let currentActive = document.querySelector(".nav-links div span.active");

// 为每个导航链接添加点击事件
navLinks.forEach((link) => {
    link.addEventListener("click", function () {
        // 如果点击的就是当前active的元素，不做任何操作
        if (this === currentActive) return;
        // 移除当前active元素的active类
        if (currentActive) {
            currentActive.classList.remove("active");
        }
        // 给当前点击的链接添加active类
        this.classList.add("active");
        // 更新当前active元素的引用
        currentActive = this;
    });
});
