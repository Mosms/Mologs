---
layout: post
title: "Some Definitions Related with MCMT"
description: "Some Useful Definitions."
categories: [MCMT-note]
tags: [MCMT, Math Notes, Definitions]
redirect_from:
  - /2024/03/06/
---

# MCMT-Related Definitions

Last Updated: 2024/3/6

[Markov Chains](#Markov Chains), [Random Mapping Representation](#Random Mapping Representation), [Irreducibility and Aperiodicity](#Irreducibility and Aperiodicity)

## Markov Chains

**Markov Chain** is a sequence of random variables $\left(X_{1},X_{2},\ldots\right)$ with **state space** $\mathcal{X}$ and **transition matrix** $P$, which satisfies that for all $x,y\in\mathcal{X}$, all $t\in\mathbb{N}^{+}$, and all events $H_{t-1}=\bigcap_{s=0}^{t-1}\left\{X_{s}=s_{s}\right\}$ satisfying $\mathbf{P}\left(H_{t-1}\cap \left\{X_{t}=x \right\} \right)$, 
$$
\mathbf{P}\left(X_{t+1}=y\mid H_{t-1}\cap\left\{X_{t}=x \right\} \right)
=
\mathbf{P}\left(X_{t+1}=y\mid X_{t}=x \right)
\label{eq:Markov Property.}
$$
where property $\left(\ref{eq:Markov Property.}\right)$ is also called **Markov property**.

+ 一个中文成语可以贴切形象地形容这种性质：步步为营。

### Notations Used

+ $\mathbf{P}_{\mu}$, $\mathbf{E}_{\mu}$. (meanning: $\mu_{0}=\mu$)
+ $\mathbf{P}_{x}:=\mathbf{P}_{\delta_{x}}$, $\mathbf{E}_{x}:=\mathbf{E}_{\delta_{x}}$.

## Random Mapping Representation

A **random mapping representation** of a transition matrix $P$ on state space $\mathcal{X}$ is a function $f:\mathcal{X}\times \Lambda\to\mathcal{X}$, along with a $\Lambda$-valued random variable $Z$, satisfying
$$
\mathbf{P}\left(f\left(x,Z\right)=y\right)
=
P\left(x,y\right)
$$

+ 将随机性用随机变量来表示，用分布族代替概率矩阵，更加方便易于理解。

+ Every transition matrix on a finite state space has a random mapping representation.

  证明就是构造随机变量。（Construction of Arbitrary Random Variables）

## Irreducibility and Aperiodicity

A chain $P$ is called **irreducible** **iff**
$$
\forall x,y\in\mathcal{X}, \exists t\in\mathbb{N}^{+}, P^{t}\left(x, y\right)>0
$$
The **period** of state $x$ is defined to be the **greatest common divisor** of $\mathcal{T} \left(x\right)$, where $ \mathcal{T} \left(x\right) := \left\{t \geq 1 : P^{t} \left(x,x\right) > 0\right\}$ is set to be the set of times when it is possible for the chain to return to starting position $x$.