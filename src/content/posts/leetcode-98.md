---
title: '[LeetCode] 98. Validate Binary Search Tree'
pubDate: 2018-07-07 21:46:12
categories: ["解题报告"]
tags:
- 解题报告
- LeetCode
- Python
- 树
- 递归
---

## 题目

Given a binary tree, determine if it is a valid binary search tree (BST).

Assume a BST is defined as follows:

- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.

**Example 1:**

```
Input:
    2
   / \
  1   3
Output: true
```

**Example 2:**

```
    5
   / \
  1   4
     / \
    3   6
Output: false
Explanation: The input is: [5,1,4,null,null,3,6]. The root node's value
             is 5 but its right child's value is 4.
```

## 解题报告

这题主要考查的是二叉搜索树的性质，也就是对于每一个节点来说，它左子树的所有元素都小于它，而右子树的所有元素都大于它。也就是说二叉搜索树在本题中不允许出现两个节点值相同的情况。

### 方法一：前序遍历检查是否满足顺序

二叉搜索树的一个重要特征是，它的前序遍历是符合大小顺序的，因为前序遍历用的是左中右的顺序，这应该就很好理解啦。

```python
class Solution:
    def isValidBST(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        self.traverse = []
        self.dfs(root)
        return all(a < b for a, b in zip(self.traverse, self.traverse[1:]))

    def dfs(self, node):
        if not node:
            return
        self.dfs(node.left)
        self.traverse.append(node.val)
        self.dfs(node.right)
```

### 方法二：另一种利用性质的递归

另一种方法来自于 Leet Code 的讨论区。这种方法的中心思想利用的是节点大小的传递性：对于每个节点来说，它的左子节点的最大值是这个节点的值，而最小值维持和这个节点的最小值相同，右子节点同理。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

def check_node(node, l, r):
        if not node:
            return True
        return l < node.val and node.val < r and check_node(node.left, l, node.val) and check_node(node.right, node.val, r)

class Solution:
    def isValidBST(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        l, r = float("-inf"), float("inf")
        return check_node(root, l, r)
```
