---
title: '[LeetCode] 111. Minimum Depth of Binary Tree'
date: 2018-07-04 22:20:12
category: 解题报告
tags: 
- 解题报告
- LeetCode
- Python
- 树
- 递归
---

## 题目

Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.

**Note:** A leaf is a node with no children.

**Example:**

Given binary tree `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```

return its minimum depth = 2.

<!--more-->



## 解题报告

### 思路

反正就是，有叶子就往下找，没叶子就完事儿了嘛～



### 方法一：递归

在处理一颗树的时候递归往往是很容易想到的方法，对于每个节点只要检查左子树和右子树就可以了。但是这种方法其实要检查整颗树，多！不！划！算！啊！

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def minDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if not root:
            return 0
        elif not root.left:
            return self.minDepth(root.right) + 1
        elif not root.right:
            return self.minDepth(root.left) + 1
        return min(self.minDepth(root.left), self.minDepth(root.right)) + 1
```



### 方法二：递推

按从上往下的顺序往列表里加节点，一旦节点没有叶子了，就可以直接返回了！

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def minDepth(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        if not root:
            return 0
        
        check = [(root, 1)]
        while check:
            node, depth = check.pop(0)
            if not node.left and not node.right:
                break
            if node.left:
                check.append((node.left, depth+1))
            if node.right:
                check.append((node.right, depth+1))
                
        return depth
```



## 结语

虽然很简单，但是越简单的题目越是能看出基础的好坏，而且也更容易往外拓展出更多题呢 (〃∀〃) 