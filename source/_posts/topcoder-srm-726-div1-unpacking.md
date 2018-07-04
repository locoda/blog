---
title: '[TopCoder-SRM 726] Unpacking'
date: 2018-07-03 22:46:50
category: 解题报告
tags: 
- 解题报告
- TopCoder
- 动态规划
- 背包问题
---

## 题目

[TopCoder链接](http://community.topcoder.com/stat?c=problem_statement&pm=14759)

### Problem Statement

The holidays are near. Hero would like to buy some candies, so he went to the store. In the store he found some boxes. Each box has a label with three positive integers **a**[i], **b**[i], and **cost**[i]. Their meaning is as follows: Obviously, **cost**[i] is the amount Hero has to pay to buy this box. The other two numbers promise that the box will contain exactly **a**[i] red candies and exactly **b**[i] blue candies (and nothing else). Hero knows that the total number of candies always matches the label, but the colors sometimes don't. Sometimes, exactly one candy in the box has the opposite color. Thus, for each box we have three possibilities: instead of (**a**[i] red, **b**[i] blue) we can also get (**a**[i]+1 red, **b**[i]-1 blue) or (**a**[i]-1 red, **b**[i]+1 blue). Hero is going to buy some of the boxes. Then, he will bring them home, he will unpack all boxes and pool all candies together. Hero will be happy if the final pile of candies will contain at least **K** candies of the same color. Find the cheapest set of boxes such that it is guaranteed that Hero will be happy if he buys these boxes. Return the cost of that set of boxes. If it is impossible to guarantee Hero's happiness, return -1 instead.

<!--more-->

### Constraints

- **a**, **b** and **cost** will contain the same number of elements.
- **a** will contain between 1 and 50 elements, inclusive.
- Each element in **a**, **b** and **cost** will be between 1 and 10,000, inclusive.
- **K** will be between 1 and 10,000, inclusive.

### Test cases

太长了，请去原网站看吧……



## 解题报告

事实上这一题用来面别人了（虽然其实要求只要做基础的背包就够了，这我还是写得出的），但是面试的途中发现自己对这道题的领悟确实也不够深，因此把思路写下来提示自己。（代码也没有写的，拆分了之后用普通背包问题的代码就可以做，不赘述了）

### 思路

乍一看是背包，确实是背包，但却是非常特殊的背包。由于设定上的盒子中的糖果可能有不稳定的情况，没有办法简单用一个背包写出来。

比较容易想到的是把不同颜色的糖果分开处理。也就是对红色做背包时，我们的做法保证“拆开所有盒子的时候，红色糖果的数量一定超过 K”，绿色亦然。因为不稳定，每一种糖果都需要用最差情况来考虑。我们是对 a-1（或 b-1） 数组进行背包算法。

但是这是全部情况吗？不是。

反例：a = {2, 2, 2}; b = {2, 2, 2}; cost = {1, 2, 3}; k = 4。这个数据如果只考虑最坏情况的话，我们会无法选出任何一组盒子（因为 -1 后 a 和 b 都变成了 {1, 1, 1}，加起来无法构成 4），但是我们只要买前两个盒子就可以一定保证它拆开会至少有四颗某种颜色的糖（思考：为什么？）。

这种时候我们如何保证两种颜色中的一种有 k 个呢？会想一下抽屉原理吧：如果在四个抽屉里放五个球，至少会有一个抽屉有两个球。由于我们无法控制红绿各有多少个（因为可以以 1 为单位变化），我们只需要控制总数有不小于 2k - 1 个，那么一定能保证其中的某种颜色有超过 k 个。

那么有了这种情况可以涵盖前面分别的状况吗？不能。

反例：a = {1}; b = {10}; cost = {1}; k = 9。如果只看总和，这个盒子一共只有 11 颗糖，无法满足 2k - 1 = 17 的糖果数，但显然买这个盒子是可以满足 k = 9 的条件的。

或者反过来思考，只要红色和绿色中的某种糖果永远达不到 k 个，总数的条件便不用符合 2k - 1，这种情况就会退化成分别背包的情况。（思考：为什么？）

因此，我们可以使用三次背包来解决这个问题。
