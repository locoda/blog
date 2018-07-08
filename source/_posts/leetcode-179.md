---
title: '[LeetCode] 179. Largest Number'
date: 2018-07-08 16:44:21
category: 解题报告
tags: 
- 解题报告
- LeetCode
- Python
- 贪心
- 排序
---

## 题目

Given a list of non negative integers, arrange them such that they form the largest number.

**Example 1:**

```
Input: [10,2]
Output: "210"
```

**Example 2:**

```
Input: [3,30,34,5,9]
Output: "9534330"
```

**Note:** The result may be very large, so you need to return a string instead of an integer.

 

## 解题报告

首先，这是一个贪心问题，也就是说如果数字 a 和数字 b 比较 a 应该放在前面，那么整个字符串中 a 一定是会在 b 之前的；如果 a 比 b 前，b 比 c 前，a 一定会在 c 前面。这一点容易想到但是难以证明，因为这种比较相对于单纯比大小来说有违常理，但是存在规律。它和比较大小不同的是，比较大小先比较位数、再比较每一位大小；而这种比较大小的方式是可传递的。（为什么呢？因为是贪心，最好是证明哦～）

其次就是写程序的问题。众所周知大部分编程语言都可以给排序函数传入一个比较函数，比较任意两个元素的大小。由于这题的所有元素是完全可以排序的，我们只要比较两个字符串拼在一起的后数字大小就可以啦！



```python
from functools import cmp_to_key

def scmp(a, b):
    return int(b+a) - int(a+b)

class Solution:
    def largestNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: str
        """
        nums = [*map(str, nums)]
        nums = sorted(nums, key=cmp_to_key(scmp))
        return str(int(''.join(nums)))
```

