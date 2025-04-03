let nums = [1, 3, -1, -3, 5, 3, 6, 7];
let k = 3;

var maxSlidingWindow = function (nums, k) {
    const queue = [];
    const res = [];

    let i = 0;
    for (; i < k; i++) {
        while (queue.length && queue[queue.length - 1] < nums[i]) {
            queue.shift();
        }
        queue.push(nums[i]);
    }
    res.push(queue[0]);

    while (i < nums.length) {
        queue.shift();
        while (queue.length && queue[queue.length - 1] < nums[i]) {
            queue.shift();
        }
        queue.push(nums[i]);
        res.push(queue[0]);
    }

    return res;
};

console.log(maxSlidingWindow(nums, k));