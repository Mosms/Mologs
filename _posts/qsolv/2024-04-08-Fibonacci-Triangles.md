---
layout: post
title: "Triangle's Existence By Fibonacci"
description: "An algorithm problem about Triangle's Existence which can be solved by Fibonacci."
categories: [Algorithm-Problems]
tags: [Algorithm, ACM]
redirect_from:
  - /QAsolv/fib-triangle/
---
* Kramdown table of contents
  {:toc .toc}

Last Updated: 2024/04/08

# Problem

Given an **unordered** nonnegative-integer-valued ($0\leq val\leq\mathrm{max}_ {\mathrm{long\ long}}$) array $a$ with length being $n$ ($1\leq n\leq 10^{6}$), our task is to finish $m$ ($1\leq m\leq 10^{5}$) queries, each of which contains a (discrete) interval $\left[l,r\right]$, and its expected answer is whether the set of $a_{\left[l,l+1,\ldots,r\right]}$ contains three integers which can construct a triangle.

给定一个大小只多为 1e6 的无序非负数组，数组值以 long long 最大值为上限，任务是完成至多 1e5 次查询，每次查询包括一个（双向闭）区间，查询答案是这个区间内是否存在三个整数可以构成一个合法三角形。

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
        cin >> l >> r;
        int len = r - l + 1;
        bool succ = false;
      
        // Next Solve it
        memcpy(judge, a + l, sizeof(ll) * len);
        sort(judge, judge + len);
      
        for (int i = 0; i + 2 < len; i++) {
            if (judge[i] == 0) continue;
            if (judge[i+2] < judge[i] + judge[i+1]) {
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

Then here comes the best part of my solution: we can obtain that when this interval of array has no 0, the probability that there is no solution will become (almost **exponentially**) smaller with the increasing of the interval's length.

Let's prove this property more rigorously. This is done by **Fibonacci Sequence**, when this interval of array has no solution, we can claim $a_ {i+2}\geq a_ {i+1}+a_ {i}$ for all legal $i$ in $\left[l,r\right]$, so the increasing of value must be (at least) as exponential as Fibonacci sequence. And for a 1-1-started Fibonacci sequence $F$, we can prove[^1]:

$$
F_ {n} = \frac{1}{\sqrt{5}}\left(\phi^{n} - \hat{\phi}^{n}\right) \text{ for }
\begin{cases}
\phi = \frac{\sqrt{5}+1}{2}
\\
\hat{\phi} = \frac{1-\sqrt{5}}{2}
\end{cases}
$$

So based on this property, we can get a proposition (from the maximum limitation of array value) that for a long enough zero-0 interval, there must be some solution.

Using a C++ program, we can easily calculate the threshold as **93**:

```c++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int maxn = 400;
ll fib[maxn];

int main() {
    fib[0] = 0;
    fib[1] = fib[2] = 1;
    int idx = 2;
    while (fib[idx] > 0) {
        idx++;
        fib[idx] = fib[idx-1] + fib[idx-2];
    }// 溢出代表超出了long long的范围
    cout << idx << endl;
    return 0;
}
// output 93
```

 So we can add a check on the zero-0 interval's length, if it is longer than the threshold, we can simply put "YES" on the judging. By this improvement, we can limit the interval that needs to be BFly judged by a constant length $C$, so the final complexity is $O\left(mC\log C\right)$. This result is brilliant enough.

观察无解序列的结构，我们不难发现，排除 0 后的正序列只有在**过**斐波那契数列的情况下才有可能无解，但是因为斐波那契为指数上升序列，所以我们可以计算出临界值，并在查询时对于长序列直接判断。同时不要忘记我们也需要一个清除 0 元素的预处理，这里可以直接使用索引对应的方式进行。在预处理优化下，便将需要暴力推断的序列长度限制在了很小的范围内，优化后的复杂度为 $O\left(mC\log C\right)$，此处 $C$ 代表上述计算出的常数，这样的复杂度已经足够优秀，因为对于每次查询都是常数开销（只不过这个常数稍微有点大）。

```c++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int Maxn = 1e6+100;
const int C_limit = 93 + 2;
ll a[Maxn];
ll judge[Maxn];

ll z0a[Maxn], z0a_top = 0;
int z0a_idx[Maxn];

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
    }
  
    // pre-processing
    for (int i = 1; i <= n; i++) {
        z0a_idx[i] = z0a_top;
        if (a[i] != 0) {
            z0a[z0a_top++] = a[i];   
        }
    }
  
    for (int __t = 0; __t < m; __t++) {
        int l, r;
        cin >> l >> r;
        int len = r - l + 1;
        bool succ = false;
      
        int l_idx = z0a_idx[l], r_idx = z0a_idx[r];
        if (a[r] == 0) r_idx--;
        int z0len = r_idx - l_idx + 1;
        if (z0len >= C_limit) {
            // must have legal solution
            cout << "YES" << endl;
            continue;
        }
      
        // Else Solve it
        memcpy(judge, z0a + l_idx, sizeof(ll) * z0len);
        sort(judge, judge + z0len);
      
        for (int i = 0; i + 2 < z0len; i++) {
            if (judge[i] == 0) continue;
            if (judge[i+2] < judge[i] + judge[i+1]) {
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

## More Possible Improvments

这样的结果已经足够通过任何以 1s 为限的判题机，但是我们也可以思考是否可以有一些实现上的优化。

我的想法是空间换时间，在每个索引记录最短的有合法解的序列右端，每次暴力都更新。但是实际上，这对复杂度以及运行时间几无提升，因此不再赘述。

# Look Back

这道题来自于某企业的机试题，同学在网上查不到于是来问，我一开始想的分块，慢慢地思路转变乃顺利解决。而后觉得这个思路很好，便写下这篇博客以记录，通过文字的方式写下来感觉思路更加清晰了，只能说这道题挺有迷惑性吧。

回过头来再看这道题，其实这个解决思路是蛮不寻常的，从“判断是否有解”到“我觉得不可能有解”的转变是其中关键，总而言之是一道好题。

另，代码**未经验证**，很有可能有手糊情况出现，欢迎大家纠正。

[^1]: 这学期《组合数学》里正好有一个生成函数的证明，链接如下 [NJU TCS Link of Generating Function Proof on Fibonacci Sequence.](https://tcs.nju.edu.cn/wiki/index.php?title=%E7%BB%84%E5%90%88%E6%95%B0%E5%AD%A6_(Fall_2024)/Generating_functions#:~:text=balls.-,Fibonacci%20numbers,-Consider%20the%20following)
