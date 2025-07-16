---
title: '[LeetCode] 3. Longest Substring Without Repeating Characters'
pubDate: 2018-07-03 22:00:00
categories: ["解题报告"]
tags: 
- 解题报告
- LeetCode
- Python
- 字符串
- 贪心
---

## 题目

[LeetCode链接](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)

Given a string, find the length of the **longest substring** without repeating characters.

**Examples:**

Given `"abcabcbb"`, the answer is `"abc"`, which the length is 3.

Given `"bbbbb"`, the answer is `"b"`, with the length of 1.

Given `"pwwkew"`, the answer is `"wke"`, with the length of 3. Note that the answer must be a **substring**, `"pwke"` is a *subsequence*and not a substring.




## 解题报告

### 思路

乍一想可能是动态规划的一道题，实际上可以化简为贪心。



### 方法：滑动窗口找最大

如果用动态规划的思路去考虑的话，包括 i 位置的最长连续子字符串有两种可能性：

1. 如果之前的字符串中没有 i 位置的字符，则长度直接加一（包括这一字符即可）
2. 如果之前的字符串中有 i 位置的字符，则找到它在字符串中出现的地方，计算它上一次所在位置加一到 i 之间的长度

这样的动态规划乍一看是合理的，实际上再仔细推论便可以发现，只要知道字符串上一次出现的地方以及字符串开始的位置（或是当前字符串的长度——这两者是等价的，得知一个就可以知道另一个），更新的时候就可以立于不败之地，也不需要记录之前所有的最好状态，在空间和时间上都可以让复杂度更小。

```python
class Solution:
    def lengthOfLongestSubstring(self, s):
        """
        :type s: str
        :rtype: int
        """
        result = 0
        used = {}
        curr_start = 0
        for index, char in enumerate(s):
            if char in used and curr_start <= used.get(char, 0):
                curr_start = used.get(char, 0) + 1
            else:
                result = max(result, index - curr_start + 1)
            used[char] = index
                
        return result
```



## 结语

动态规划和贪心很多时候是一对难兄难弟：你觉得是贪心的时候，有时无法由局部最优达到全剧最优；你觉得是动态规划的时候，却发现可以简单用贪心来解决。在想问题的时候想到其中的某一种解法时想想另一种解法的可能性是最好的～