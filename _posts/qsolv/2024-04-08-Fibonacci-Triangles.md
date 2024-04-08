---
layout: post
title: "Triangles' Searching By Fibonacci"
description: "An algorithm problem about Triangle Searching which can be solved by Fibonacci."
categories: [Algorithm-Problems]
tags: [Algorithm, ACM]
redirect_from:
  - /2023/04/08/
---

* Kramdown table of contents
{:toc .toc}


Last Updated: 2024/04/08

# Problem

Given an **unordered** nonnegative-integer-valued ($0\leq val\leq \mathrm{max}_{\mathrm{long\ long}}$) array $a$ with length being $n$ ($1\leq n\leq 10^{6}$), our task is to finish $m$ ($1\leq m\leq 10^{5}$) queries, each of which contains a (discrete) interval $\left[l,r\right]$, and its expected answer is whether the set of $a_{\left[l,l+1,\ldots,r\right]}$ contains three integers which can construct a triangle.

中文版：给定一个大小只多为 1e6 的无序非负数组，数组值以 long long 最大值为上限，任务是完成至多 1e5 次查询，每次查询包括一个（双向闭）区间，查询答案是这个区间内是否存在三个整数可以构成一个合法三角形。

# Solutions

## Brute Force

The trivial **Brute Force** Algorithm can solve it with complexity $O\left(mn^{3}\right)$.

朴素的暴力算法复杂度为 $O\left(mn^{3}\right)$。

## Modified Brute Force

We can improve the way of testing whether there is a legal tripule by first sorting the values in given interval and then testing linearly. Using this strategy and $O\left(n\log n\right)$ sorting algorithm, the final complexity can be improved to $O\left(mn\log n\right)$.

可以在朴素暴力的基础上对

## Fibonacci's Answer

# Look Back on the 