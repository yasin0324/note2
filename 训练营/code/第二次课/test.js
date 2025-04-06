const { MaxPriorityQueue } = require("@datastructures-js/priority-queue");
var topKFrequent = function (nums, k) {
    const count = new Map();
    for (let i = 0; i < nums.length; i++) {
        count.set(nums[i], (count.get(nums[i]) || 0) + 1);
    }

    const maxHeap = new MaxPriorityQueue();

    // Convert map entries to array and sort by frequency
    const entries = Array.from(count.entries());
    entries.sort((a, b) => b[1] - a[1]);

    // Take the first k elements
    return entries.slice(0, k).map((entry) => entry[0]);
};

let nums = [1, 1, 1, 2, 2, 3];
let k = 2;

console.log(topKFrequent(nums, k));
