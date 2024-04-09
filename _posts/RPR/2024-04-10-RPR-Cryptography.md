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

这篇文章可能涉及很多细节定义之类，但这也不违背我博客的初衷，因为密码学的知识确实比较细，详实的复习是很有必要的。

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

## 柯克霍夫原则 Kerckhoffs’ Principle

The cipher method must not be required to be secret, and it must be able to fall into the hands of the enemy without inconvenience.

+ 公开加密方法后的安全才是真的安全，也就是说安全性完全依赖于密钥的保存。

+ 学界有不同的观点，个人觉得很合理。

# 完美保密性 Perfect Secrecy



