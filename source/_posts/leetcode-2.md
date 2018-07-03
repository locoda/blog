---
title: '[LeetCode] 2. Add Two Numbers'
date: 2018-07-03
category: 解题报告
tags: 
- 解题报告
- LeetCode
- Python
- 数组
- 模拟

---

## 题目

[LeetCode链接](https://leetcode.com/problems/add-two-numbers/description/)

You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order** and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example**

```
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
```

<!--more-->



## 解题报告

### 思路

这题算是一个高精度加法的简化版本。简单来说，这个加法其实和列竖式的想法是一致的：先把两边的数字加起来，如果进位了就把进位写上。



### 方法一：暴力相加

暴力相加使用了小学时候学习的竖式方法。把两个数字加起来看作这位，如果有进位就加上进位，要是又进位了的话就再记上进位；如果一边加完了，就对另一边的数字做同样的事情，把数字加上进位；最后如果还剩下进位就再写一位。

但是这种方法很不幸 TLE 了。虽然从复杂度角度看可能和第二种方法没有太大的差距（量级相同，但是比较次数会多很多次，也就是常数上的不同），说明这题还是严谨地卡了常数……（也可能是 Python 的时间比较吃紧）

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def addTwoNumbers(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        root = ListNode((l1.val + l2.val) % 10) 
        s = (l1.val + l2.val) // 10
        node = root
        
        while l1.next and l2.next :
            l1 = l1.next
            l2 = l2.next
            node.next = ListNode((l1.val + l2.val + s) % 10) 
            s = (l1.val + l2.val + s) // 10
            node = node.next
            
        while l1.next:
            node.next = ListNode((l1.val + s) % 10) 
            s = (l1.val + s) // 10
            node = node.next
            
        while l2.next:
            node.next = ListNode((l2.val + s) % 10) 
            s = (l2.val + s) // 10
            node = node.next
        
        if s:
            node.next = ListNode(s)
            
        return root
```



### 方法二：合并循环

仔细观察第一种解法会发现这四个循环是可以合并到同一个循环中的，也就是说只要两边的数字任意一个还有，或是进位还有的情况下，这个循环都需要继续。这种做法因为循环节中使用了` or` 而非上一种解法中的`and`性能有所提高（起码不 TLE 了）。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def addTwoNumbers(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        root = ListNode(0) 
        node = root
        c = 0
        while l1 or l2 or c:
            if l1:
                c = c + l1.val
                l1 = l1.next
            if l2:
                c = c + l2.val
                l2 = l2.next
            node.next = ListNode(c % 10)
            c = c // 10
            node = node.next
                
        return root.next
```



## 结语

了解如何使程序更快更简洁不仅是 Python 的禅，更是面试的禅呀！