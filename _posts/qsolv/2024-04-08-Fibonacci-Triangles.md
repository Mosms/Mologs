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

Given an **unordered** nonnegative-integer-valued ($0\leq val\leq\mathrm{max}_ {\mathrm{long\ long}}$) array $a$ with length being $n$ ($1\leq n\leq 10^{6}$), our task is to finish $m$ ($1\leq m\leq 10^{5}$) queries, each of which contains a (discrete) interval $\left[l,r\right]$, and its expected answer is whether the set of $a_{\left[l,l+1,\ldots,r\right]}$ contains three integers which can construct a triangle.

中文版：给定一个大小只多为 1e6 的无序非负数组，数组值以 long long 最大值为上限，任务是完成至多 1e5 次查询，每次查询包括一个（双向闭）区间，查询答案是这个区间内是否存在三个整数可以构成一个合法三角形。

# Solutions

## Brute Force

The trivial **Brute Force** Algorithm can solve it with complexity $O\left(mn^{3}\right)$.

朴素的暴力算法复杂度为 $O\left(mn^{3}\right)$。

代码很朴素，便不再放上来了。

## Modified Brute Force

We can improve the way of testing whether there is a legal tripule by first sorting the values in given interval and then testing linearly. Using this strategy and $O\left(n\log n\right)$ sorting algorithm, the final complexity can be improved to $O\left(mn\log n\right)$.

可以在朴素暴力的基础上对单个查询的策略进行优化。实际上，对于单次查询我们可以直接排序并对其进行线性遍历判断，容易证明线性判断中有/无解与实际有/无解互为充要条件，此处便不再赘述。

由此，使用最快的排序算法，我们便可以得到更优的复杂度 $O\left(mn\log n\right)$。

相应代码为：

```c++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int Maxn = 1e6+100;
ll a[Maxn];
ll judge[Maxn];

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
    }
    for (int __t = 0; __t < m; __t++) {
        int l, r;
        cin >> l, r;
        int len = r - l + 1;
        bool succ = false;
        
        // Next Solve it
        memcpy(judge, a + l, sizeof(ll) * len);
        sort(judge, judge + r - l + 1);
        
        for (int i = 0; i + 2 < len; i++) {
            if (a[i+2] < a[i] + a[i+1]) {
                succ = true;
                break;
            }
        }
        
        if (succ) {
            cout << "YES" << endl;
        }
        else {
            cout << "NO" << endl;
        }
    }
    
	return 0;
}
```

## Eliminating Long Intervals' Query By Fibonacci

# Look Back