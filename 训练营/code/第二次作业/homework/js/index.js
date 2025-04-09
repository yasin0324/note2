// 下划线动画效果
document.addEventListener("DOMContentLoaded", () => {
    // 获取所有的tab链接和下划线元素
    const tabLinks = document.querySelectorAll(".search-left .tab-link");
    const underline = document.querySelector(".underline");

    // 为每个tab添加鼠标移入事件
    tabLinks.forEach((tab) => {
        tab.addEventListener("mouseenter", () => {
            // 获取当前tab的宽度和位置
            const tabRect = tab.getBoundingClientRect();
            const searchLeftRect = document
                .querySelector(".search-left")
                .getBoundingClientRect();

            // 计算下划线的宽度和位置
            const newLeft =
                tabRect.left -
                searchLeftRect.left +
                tabRect.width / 2 -
                underline.offsetWidth / 2;

            // 设置下划线的位置
            underline.style.left = newLeft + "px";
        });
    });

    // 鼠标离开search-left区域时，恢复默认状态
    const searchLeft = document.querySelector(".search-left");
    searchLeft.addEventListener("mouseleave", () => {
        const defaultActiveTab =
            document.querySelector(".tab-link.active") || tabLinks[0];
        const event = new MouseEvent("mouseenter");
        defaultActiveTab.dispatchEvent(event);
    });
});

// 添加搜索框失去焦点时的下拉框渐出效果
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-input");
    const searchDropdown = document.querySelector(".search-dropdown");

    // 当搜索框失去焦点时
    searchInput.addEventListener("blur", function () {
        // 添加hiding类来触发向下渐出效果
        searchDropdown.classList.add("hiding");

        // 等待过渡效果完成后移除hiding类，恢复初始状态
        setTimeout(function () {
            if (!searchInput.matches(":focus")) {
                searchDropdown.classList.remove("hiding");
            }
        }, 300); // 与过渡时间一致
    });
});

// 处理"上传"弹出框中图片的切换
document.addEventListener("DOMContentLoaded", function () {
    // 获取所有需要触发banner切换的元素
    const audioEditItem = document.querySelector(
        ".popover-item .audio-edit"
    ).parentNode;
    const myProgramItem = document.querySelector(
        ".popover-item .my-program"
    ).parentNode;

    // 获取banner元素
    const banner1 = document.querySelector(".banner1");
    const banner2 = document.querySelector(".banner2");

    // 默认显示banner1
    banner1.classList.add("active");

    // 鼠标悬停在"音频剪辑"上时显示banner1
    audioEditItem.addEventListener("mouseenter", function () {
        banner2.classList.remove("active");
        banner1.classList.add("active");
    });

    // 鼠标悬停在"我的节目"上时显示banner2
    myProgramItem.addEventListener("mouseenter", function () {
        banner1.classList.remove("active");
        banner2.classList.add("active");
    });

    // 鼠标离开popover再进入时恢复默认状态
    const popover = document.querySelector(".popover");
    popover.addEventListener("mouseleave", function () {
        setTimeout(function () {
            if (
                !audioEditItem.matches(":hover") &&
                !myProgramItem.matches(":hover")
            ) {
                banner1.classList.add("active");
                banner2.classList.remove("active");
            }
        }, 300);
    });
});
