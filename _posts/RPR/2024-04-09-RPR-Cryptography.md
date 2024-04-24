---
layout: post
title: "RPR: Cryptography"
description: "Cryptography Review for Postgraduate Recommendation"
categories: [RPR-Review-for-Postgraduate-Recommendation]
tags: [Review for Postgraduate Recommendation, Cryptography]
redirect_from:
  - /RPR/crypto/
---

* Kramdown table of contents
{:toc .toc}

开始之前，你可能需要看一下有关此系列博客的介绍 [RPR: Before All. Introduction](/Mologs/RPR/intro/) 。


# 密码学篇 Cryptography

# 开始之前 Before All

所用教材为***Introduction to Modern Cryptography***，中文版为《现代密码学——原理与协议》，复习跟随 NJU 密码学原理课程（上学期刚学的，还有印象，应该能很快拾起来）。

这篇文章可能涉及很多细节定义之类，但这也不违背我博客的初衷，因为密码学的知识比较细而且对于定义的严格性有很高要求，详实的复习是很有必要的。

# 通论 Intro part

密码学的主要功能是实现信息的安全通信，这个**安全**包含信息保密和信息正直两个部分。

+ 两个部分分别代表“没人知道说了什么”和“此信息确实是对方发的且没有人改过信息”。
+ Message Secrecy (or Confidentiality) and Message Integrity (or Authenticity).

More advanced usages/functionalities are provided as cryptographic protocols, e.g.

+ Oblivious Transfer (不经意传输)
+ Zero-knowledge Proof (零知识证明)
+ Secure Multiparty Computation (多方安全计算)
+ Digital Currency (数字货币)

什么是密码学安全？

+ 加密算法保密？
+ 解密时间长？
  + 计算机的破译速度上升；新算法的提出
  + 在特殊时期内也有作用，例如只需要保证一定时间内的保密

重点关注：

+ Rigorous Definition of Security
+ Cryptographic Primitives
+ Cryptographic Protocols

# 古典密码 Classical Ciphers

## 古典密码之例 Examples

+ 凯撒密码（Caesar’s cipher）与移位密码（Shift cipher）

  + 凯撒密码可以看作移位密码的特殊情况（移三位）；移位密码可以看作随机化的凯撒密码（移位大小随机选取，但仍统一使用）。
  + 为什么不安全呢？密码空间过小，暴力试都能试出来。
  + 学到的教训：充分密钥空间原则（Sufficient Key Space Principle）
    + Any secure encryption scheme must have a key space that is not vulnerable to exhaustive search.
    + 至少穷举不行，不然暴力搜索就已经是一个可行解算法了。

+ 单字母替换密码（The Mono-alphabetic Substitution Cipher）**MAS**

  一个简单的单字母双射，逆函数也是双射。

  + Key Space $26! \approx 2^{88}$，目前来看至少穷举是不太行了。
  + 但是有其他有效攻击方式，例如利用单字母的对应关系始终不变而进行的统计攻击。
    + 可以攻击特定字母的分布频率，信息越长成功概率越高，例如攻击元音字符。

+ 多字母替换密码（Poly-alphabetic Substitution Cipher）**PAS**

  The encryption/decryption is defined with a mapping/inverse-mapping which is applied on **blocks** of plaintext characters.
  
  + 字母块替换

+ 维吉尼亚密码/多字母移位密码（The Vigenère cipher/poly-alphabetic shift）

  用单词（或者理解为一个密钥）来规定每一位移位的大小

  + A special case of the poly-alphabetic substitution cipher.
  + 相对于多字母替换密码来说，更好理解也更好用。
  + 破解方法：先判定长度，再拆分成长度个单字母移位来破解。
    + 长度的破解关键在于重复的模式（repeated patterns）。
    + 总地来说，在“密钥”较好的情况下破解有难度，但是仍被视为不安全。

+ 自动破解移位密码的方法（An easy-to-automate statistical attack on shift ciphers）

  + 核心在于计算一个量化矩阵。

    A quantitative metric that measures the correctness of a “guess” needs to be computed.

    最接近于
    
    $$
    \sum_{i=1}^{26}p_ {i}^ {2} \approx 0.065
    $$
    
    的移位大小即为所需结果。

## 古典为何称之为古典？

+ 古典密码更像一种艺术，而不是技术。
  + 很美，但没有大用。（在现代密码学意义下都不安全）
+ 慢慢地，现代密码学发展为一门科学，基本范式为**理论范式**（Rigorous Proofs）。
  + 究极目标是给出合理构造并严格证明其安全性。
  + 强调对安全的严格定义（首先要明确有多安全）。
  + 强调对于特定**难**问题的未证明假设。
+ 现代密码学的三个原则：
  1. Formal Definitions
     + 形式化的安全定义与相应的安全威胁模型
       + 例如**KPA**，**CPA**，**CCA**等。
  2. Precise Assumptions
     + 基于对某个特定难问题的复杂度假设。
       + 例如大数分解，离散对数，椭圆曲线离散对数等。
  3. Proofs of Security
     + 可证明的安全不一定代表现实中的应用安全。
     + 不一定是个缺点，这使得我们可以集中于已有的假设，并专心攻克。

## 柯克霍夫原则 Kerckhoffs' Principle

The cipher method must not be required to be secret, and it must be able to fall into the hands of the enemy without inconvenience.

+ 公开加密方法后的安全才是真的安全，也就是说安全性完全依赖于密钥的保存。

+ 学界有不同的观点，个人觉得很合理。

# 完美保密性 Perfect Secrecy

## 前置知识 概率

+ 概率的定义、条件概率
+ 点对独立（Pairwise Independent）、相互独立（Mutually Independent）
+ 全概率公式（Total Probability Formula (or law)）
+ 贝叶斯定理（Bayes' Theorem）

## 加密方法 Encryption Scheme

A **encryption scheme** $\Pi$, also called a **cipher** or a **cryptosystem**, is defined by three algorithms $\mathbf{Gen}$, $\mathbf{Enc}$, and $\mathbf{Dec}$, as well as a specification of a finite message space $\mathcal{M}$ with $size(\mathcal{M}) >1$.

+ $\mathbf{Gen}$ 为随机化的密钥生成函数，概率性地从有限的密钥空间 $\mathcal{K}$ 中取出一个密钥 $k$ 用于加密。
+ $c:=\mathbf{Enc}_ {k} (m  )$
+ $m:=\mathbf{Dec}_ {k} (c )$

## 完美保密性 Perfect Secrecy

An encryption scheme $ (\mathbf{Gen},\mathbf{Enc},\mathbf{Dec} )$ over a massage space $\mathcal{M}$ is **perfect secret** if for every possible distribution over $\mathcal{M}$,

$$
Pr (M = m\mid C = c ) = Pr (M = m )
$$

holds for every $m \in \mathcal{M}$ and every $c \in \mathcal{C}$ that $Pr (C = c ) > 0$.

+ 完美保密性的本质：密文不提供任何有关明文的信息，但是请注意这里仅局限于单个明文-密文的对应，其实仅仅是对加密过程的安全性进行了限制。

### 引理 完美保密性的等价表达

完美保密等价于

$$
Pr ( C = c\mid M = m ) = Pr ( C = c\mid M = m'  )
$$

+ This formulation states that the probability distribution over $\mathcal{C}$ is **independent** of the plaintext.
+ 其证明是对条件概率和全概率法则的生动应用。

## 敌手完美不可区分性 Perfect Adversarial Indistinguishability

+ 对手 $\mathcal{A}$，选择一对明文 $ (m_{0}, m_{1} )$，发送给挑战者，挑战者选择密钥，随机选择明文对中的一个并加密为密文发送给对手，对手返回猜测的解密结果，如果相等则成功。整个攻击事件表示为 $\mathrm{PrivK}_{A, \Pi}^{eav}$， 为 $1$ 则成功，反之失败。

相应地，完美不可区分性则定义为 $Pr (\mathrm{PrivK}_ {A, \Pi}^{eav}=1 )=\frac{1}{2}$ 的加密方法。

+ The definition states that every adversary would do no better or worse in the game than making a uniformly random guess.

  无论对手做什么，成功概率和乱猜都没区别。

### 引理 完美保密性和敌手完美不可区分性

**Perfect Secrecy** holds if and only if it is **Perfect Adversarial Indistinguishability** holds.

## 例子 One-time Pad

长度固定的随机比特串，直接亦或以加密或解密。

+ 具有完美保密性；
+ 其问题在于密钥要求和信息一样长，安全性只有在使用一次时才能保证且但凡同时拥有一对明密文就会被直接攻破。

## 限制性

**定理**：完美保密的加密方法中，一定有密钥空间大于明文空间。

## 香农定理

如果我们有 $size(\mathcal{M}) = size(\mathcal{C}) = size(\mathcal{K})$，那么加密方法的完美保密性有充要条件：

1. 密钥等概率生成
2. 密钥与明-密文对具有一一对应性。
