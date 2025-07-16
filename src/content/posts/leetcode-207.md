---
title: '[LeetCode] 207. Course Schedule'
pubDate: 2018-07-04 21:42:26
categories: ["解题报告"]
tags: 
- 解题报告
- LeetCode
- Python
- 图论
---

## 题目

[LeetCode 链接](https://leetcode.com/problems/course-schedule/description/)

There are a total of *n* courses you have to take, labeled from `0` to `n-1`.

Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: `[0,1]`

Given the total number of courses and a list of prerequisite **pairs**, is it possible for you to finish all courses?

**Example 1:**

```
Input: 2, [[1,0]] 
Output: true
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0. So it is possible.
```


**Example 2:**

```
Input: 2, [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.
```

**Note:**

1. The input prerequisites is a graph represented by **a list of edges**, not adjacency matrices. Read more about [how a graph is represented](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs).
2. You may assume that there are no duplicate edges in the input prerequisites.



## 解题报告

### 思路

简单来说这个问题因为要看课程之间的前置要求是否是互相冲突的。如果把每一节课看成一个点，前置关系看成边（有向），那么这个问题就是寻找一个有向图是否有环。如果有环的话，图中的课便没有办法同时完成。



### 方法一：搜索

搜索只要检查自己搜索过的部分是不是会再一次被搜索到就可以检查是否有环。

搜索的具体实现有很多种。不论是使用 bfs 还是 dfs 或是引入 order 的概念都可以很快找到一个解法，这里就不赘述了。



### 方法二：拓扑排序

拓扑排序的想法很简单：如果有点只出不进，那说明这个点就是这一张图的起点。我们把这个点和由他出去的边删去，然后再检查是否有点只进不出的点，如此重复。如果一张图可以无限删除直到结束，说明这张图是可以拓扑排序的，因此没有环。（思考：为什么？）

```python
class Solution:
    def canFinish(self, numCourses, prerequisites):
        """
        :type numCourses: int
        :type prerequisites: List[List[int]]
        :rtype: bool
        """
        in_degree = {}
        out_degree = {} 
        for i in range(numCourses):
            in_degree[i] = 0
            out_degree[i] = []
        for e in prerequisites:
            in_degree[e[1]] = in_degree[e[1]] + 1
            out_degree[e[0]].append(e[1])
        
        can_delete = []
        for i in range(numCourses):
            if in_degree[i] == 0:
                can_delete.append(i)
                
        while can_delete:
            deleted = can_delete.pop()
            in_degree[deleted] = -1
            for course in out_degree[deleted]:
                if in_degree[course] > -1:
                    in_degree[course] = in_degree[course] - 1
                    if in_degree[course] == 0:
                        can_delete.append(course)
                        
        return (max(in_degree.values()) <= -1)

```

### 复杂度

时间复杂度 O(n+e)，其中 n 为定点数，e 为边数：初始化 O(e), 删除的点 O(n), 删除边 O(e), 后处理 O(n)

额外空间 O(n+e) ：入度数组 n，出度哈希表 e，待删除队列 n



## 结语

这题考了两个知识点，一是能不能把这个问题转换成图论问题（面试官可不会和 LeetCode 一样傻乎乎地提到这是图的一种表现方式），另一个就是检查图是否有环。我这里只提到了比较好理解的检查环的两种方式，其他方法也可以顺便复习一下哦～