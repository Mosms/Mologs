---
layout: post
title: "RPR: Cryptography"
description: "Cryptography Review for Postgraduate Recommendation"
categories: [RPR-Review-for-Postgraduate-Recommendation]
tags: [Review for Postgraduate Recommendation, Cryptography]
redirect_from:
  - /RPR/crpto/
---

* Kramdown table of contents
{:toc .toc}


# 密码学篇 Cryptography

# 开始之前 Before All

所用教材为***Introduction to Modern Cryptography***，中文版为《现代密码学——原理与协议》，复习跟随 NJU 密码学原理课程（上学期刚学的，还有印象，应该能很快拾起来）。

这篇文章可能涉及很多细节定义之类，但这也不违背我博客的初衷，因为密码学的知识确实比较细，比较多，需要仔细一点。

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

+ 凯撒密码（Caesar’s cipher）与移位密码（Shift cipher）

  + 凯撒密码可以看作移位密码的特殊情况（移三位）；移位密码可以看作随机化的凯撒密码（移位大小随机选取，但仍统一使用）。
  + 为什么不安全呢？密码空间过小，暴力试都能试出来。
  + 学到的教训：充分密钥空间原则（Sufficient Key Space Principle）
    + Any secure encryption scheme must have a key space that is not vulnerable to exhaustive search.
    + 至少穷举不行，不然暴力搜索就已经是一个可行解算法了。

  单字母替换密码（The Mono-alphabetic Substitution Cipher）