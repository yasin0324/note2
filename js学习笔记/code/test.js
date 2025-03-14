var fourSum = function (nums, target) {
    let n = nums.length;
    nums.sort((a, b) => a - b);
    let res = [];

    for (let k = 0; k < n; k++) {
        if (nums[k] > target && nums[k] > 0) return res;
        if (k > 0 && nums[k] === nums[k - 1]) continue;
        for (let i = k + 1; i < n - 2; i++) {
            if (nums[k] + nums[i] > target && nums[k] + nums[i] > 0) return res;
            if (i > k + 1 && nums[i] === nums[i - 1]) continue;
            let left = i + 1;
            let right = n - 1;
            while (left < right) {
                if (nums[k] + nums[i] + nums[left] + nums[right] === target) {
                    res.push([nums[k], nums[i], nums[left], nums[right]]);
                    while (left < right && nums[left] === nums[left + 1])
                        left++;
                    while (left < right && nums[right] === nums[right - 1])
                        right--;
                    left++;
                    right--;
                } else if (
                    nums[k] + nums[i] + nums[left] + nums[right] >
                    target
                )
                    right--;
                else if (nums[k] + nums[i] + nums[left] + nums[right] < target)
                    left++;
            }
        }
    }

    return res;
};

console.log(fourSum([-5, -4, -3, -2, -1, 0, 0, 1, 2, 3, 4, 5], 0));
