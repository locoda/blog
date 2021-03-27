---
title: '[LeetCode] 189. Rotate Array'
date: 2018-07-02
category: 解题报告
tags: 
- 解题报告
- LeetCode
- Python
- 数组
- 模拟
- 数论
---

## 题目

[LeetCode链接](https://leetcode.com/problems/rotate-array/description/)

Given an array, rotate the array to the right by *k* steps, where *k* is non-negative.

**Example 1:**

```
Input: [1,2,3,4,5,6,7] and k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]
```

<!--more-->

**Example 2:**

```
Input: [-1,-100,3,99] and k = 2
Output: [3,99,-1,-100]
Explanation: 
rotate 1 steps to the right: [99,-1,-100,3]
rotate 2 steps to the right: [3,99,-1,-100]
```

**Note:**

- Try to come up as many solutions as you can, there are at least 3 different ways to solve this problem.

- Could you do it in-place with O(1) extra space?

  

## 解题报告

### 思路

这是一道原题相对简单的模拟题。要写出一个简单能够通过而不超时的方法并不难，只要利用至多k元素的空间，就可以完成数组的拆解和重新拼接。

难点在思考题中的 **O(1) extra space** 部分。这说明我们只能使用常数个临时元素，而这个常数不能随数组长度或事 k 的大小而变化。因此，我们使用 k 个元素的临时数组完成交换的想法是无法实现的。因此解法涉及到一些想法和数论知识。



### 方法一：暴力拆解

暴力拆解的解法就不多说了，就是将数组拆为两个部分再拼接，只需要计算好拆解的位置即可：

```python
class Solution(object):
    def rotate(self, nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: void Do not return anything, modify nums in-place instead.
        """
        k = k % len(nums)
        nums[:] = nums[len(nums)-k:] + nums[:len(nums)-k]
        # 或是利用 Python 负数 index 的特性：nums[:] = nums[-k:] + nums[:-k] 
```

需要提示的是，虽然不进行第一步的取模操作也仍然能通过，我还是建议对 k 取模以保证解法的严谨性，因为题目中从未保证 k 是一个小于 n 的数字。

另外数组的更新需要使用 `nums[:]` 而非`nums`，原因是`nums`在函数中被重新赋值会被视作是本地变量，而非传入的参数（很复杂，需要研究 Python 原理了……）。

#### 复杂度

该算法的时间复杂度可以视作 O(1)，但数组的拆解利用了额外 O(n) 的空间。



### 方法二：循环更新 

循环更新的方法更多的思考，但是也是为数不多时间复杂度够好也仅用 O(1) 空间复杂度的方法。

如果只给一个临时变量的话，很多人的第一想法一定是一位一位移、循环 k 次，就可以得到结果数组，但这种往往太过复杂；而第二想法就会是，把 0 位的数移到 k 位，再把 k 位的移到 2k 位，以此类推……

但是我们如何保证这种做法遍历一次数组呢？不如想想跳跃多少个 k 次可以回到原点点吧。为了简化问题，我们就从 0 开始跳跃，跳回到 0 点的条件便是所在位置是 n 的倍数。我们把 k 和 n = len(nums) 的关系简单分成三种：

1. n 是 k 的倍数时：一共需要 {% katex %}\frac{n}{k}{% endkatex %} 次到达越界的 n 次，从而重新回到 0 点。
2. n 和 k 互质时：由于互质，在 {% katex %}k \times n{% endkatex %} 前，k 的倍数无法成为 n 的倍数，因此一共需要 n 次才能达到 n 的倍数，从而重新回到 0 点。
3. 当 n 和 k 既不互素也不是倍数的时候：一共需要{% katex %}\frac{LCM}{k}{% endkatex %}次跳跃，就能回到 0 点了。（{% katex %}LCM{% endkatex %}为最小公倍数）

当这样理下来之后，我们就会发现三种情况完全就是一模一样的：不论 k 和 n 是什么关系，循环一次所需的跳跃步数一共是 k 和 n 的**最小公倍数除以 k **次。由于每一个数字在交换一次时就会处于自己应该在的地方，所以总共需要的交换的次数是 n 次，因此一共需要 {% katex %}\frac{n\times k}{LCM}=GCD{% endkatex %} 次循环。（{% katex %}LCM{% endkatex %}为最小公倍数，{% katex %}GCD{% endkatex %}为最大公约数）

那么这最大公约数次的循环如果从 0 开始，第二个数字要怎么选呢？反过来想，如果我们选的下一个数字就是 1 会怎样呢？我们看看 0 的下一个数字 1 有什么看法。假如说 0 和 1 在一个循环中同时被更新了，那说明什么呢？简单来说，因为每 k 数会被更新一次，因此，{% katex %}(0 + k \times a) \mod n = 1{% endkatex %} ，进行化简后我们发现{% katex %}k\times a - n\times b = 1{% endkatex %}。对啦！这正是大名鼎鼎的拓展欧几里得公式，而等式右边的 1 说明了 k 和 n 是互质的两个数（如果有兴趣的话，你也可以证明 1 之后可以选 2，2 之后可以选 3……）。也就是说，在除了互质的情况下，如果我们的循环结束了，选择开始数字的下一个准没错。你问互质的情况怎么办？看看上面的推论，如果 k 和 n 互质的话，再回到 0 点的时候一圈数字就都更新完了。

当我们证明了这一切之后，写代码就变得容易了起来：

```python
class Solution(object):
    def rotate(self, nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: void Do not return anything, modify nums in-place instead.
        """
        k = k % len(nums)
        count = 0
        for start in range(len(nums)):
            if count == len(nums):
                break
            temp = nums[start]
            curr = (start + k) % len(nums) 
            while curr != start:
                nums[curr], temp = temp, nums[curr]
                curr = (curr + k) % len(nums)
                count += 1
            nums[curr] = temp
            count += 1    
```

#### 复杂度

由于每个数字只被更新一次，时间复杂度为 O(n)；由于只用了常数个临时变量（count, start, curr, temp），空间复杂度为 O(1)



## 结语

时间换空间的算法深入人心，在结题报告中，我列举了两种算法，其中一种用时应当更短，但占用更多空间；而另一种用时稍长，但几乎不需要额外空间。除了记住这一题的解法，我觉得更重要的是掌握时间和空间的魔法吧╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ