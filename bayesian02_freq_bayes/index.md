# B｜Chapter 2


## Chapter 2 - The Subjective Worlds of Frequentist and Bayesian Statistics

频率学派和贝叶斯统计的主观世界

### 2.1. Chapter Mission Statement

At the end of this chapter, the reader will understand the purpose of statistical inference, as well as recognise the similarities and differences between Frequentist and Bayesian inference. We also introduce the most important theorem in modern statistics: Bayes’ Theorem.

在本章的最后，读者将了解统计推断的目的，以及认识到频率论和贝叶斯推断之间的异同。 我们还介绍了现代统计学中最重要的定理：贝叶斯定理。

### 2.2. Chapter Goals

As data scientists, we aim to **build predictive models** to **understand complex phenomena**. As a first approximation, we typically **disregard** those parts* of the system that are *not* directly of *interest*. This *deliberate omission\* of information **makes these models statistical rather than deterministic** because there are some aspects of the system about which we are **uncertain**.

作为数据科学家，我们的目标是**构建预测模型**来**理解复杂的现象**。 我们通常首先会尝试**忽略系统中不直接感兴趣**的那些部分。 这种*故意的信息遗漏*使得这些模型**具有统计性而不是确定性**，因为我们对系统的某些方面是**不确定的**。

There are two distinct approaches to statistical modelling: **Frequentist (also known as Classical inference) and Bayesian inference**. This chapter explains the _similarities_ between these two approaches and, importantly, indicates where they _differ substantively_. Usually, it is _straightforward to calculate the probability_ of obtaining different data samples if we know _the process that generated the data_ in the first place.

统计建模有两种不同的方法：**频率学派（也称为经典推断）和贝叶斯推断**。 本章解释了这两种方法之间的*相似*之处，重要的是，指出了它们的*实质性区别*。 通常，如果我们首先知道*生成数据的过程*，就可以*直接计算*获得不同数据样本的概率。

For example, if we know that a coin is fair, then we can calculate the probability of it landing heads up (the probability equals 1/2). However, we typically **do not have perfect knowledge of these processes**, and it is the goal of statistical inference to **derive estimates of the unknown characteristics, or parameters**, of these mechanisms.

例如，如果我们知道一枚硬币是公平的，那么我们可以计算出它正面朝上落地的概率（概率等于 1/2）。 然而，我们通常**不具有这些过程的完美知识**，并且统计推断的目标是**推导出这些机制的未知特征或参数的估计**。

In our coin example, we might want to **determine its bias towards heads** on the basis of the **results of a few coin throws**. Bayesian statistics allows us to go from what is known – the data (the results of the coin throw here) – and extrapolate backwards to make probabilistic statements about the parameters (the underlying bias of the coin) of the processes that were responsible for its generation.

在我们的硬币例子中，我们可能希望**根据几次抛硬币的结果**来**确定它朝正面的倾向**。 贝叶斯统计允许我们从**已知的数据（掷硬币的结果）**出发，向后推断出**导致硬币产生的过程的参数（硬币的潜在倾向）的概率陈述**。

In Bayesian statistics, this **inversion process** is carried out by application of Bayes’ rule, which is introduced in this chapter. It is important to have a good understanding of this rule, and we will spend some time throughout this chapter and Part II developing an **understanding of the various constituent components of the formula**.

在贝叶斯统计中，这种**反演过程**是通过应用贝叶斯规则来实现的，这一章将介绍。 很重要的一点是，我们要很好地理解这条规则，在本章和第二部分中，我们将花一些时间来**理解公式的各个组成部分**。

### 2.3. Bayes' Theorem - Allowing us to go From the Effect back to its Cause （从结果回到原因）

Suppose that we know that a casino is crooked(不正当的赌场) and uses a loaded die（灌了铅的骰子） with a probability of rolling a 1, that is $\frac{1}{3}=2 \times \frac{1}{6}$, twice its unbiased value. We could then calculate the probability that we roll two 1s in a row:
$$Pr(1,1| \text{crooked casino}) = \frac{1}{3} \times \frac{1}{3} = \frac{1}{9}$$

In this case, we have **presupposed a cause** – the casino being crooked – to derive the **probability of a particular effect** – rolling two consecutive 1s. In other words, we have calculated Pr(effect | cause).
在这种情况下，我们已经预先**假定了一个原因** —— 赌场是不正当的 —— 来推导出一个**特定结果的概率** —— 连续掷出两个 1。 换句话说，我们已经计算知道原因的前提下，特定结果的概率。

Until the latter half of the seventeenth century, **probability theory was chiefly used as a method to calculate gambling odds**, in a similar vein to our current example. It was viewed as a dirty subject, not worthy of the attention of the most esteemed mathematicians. This perspective began to change with the intervention of the English Reverend Thomas Bayes, and slightly later and more famously (at the time at least), with the work done by the French mathematician Pierre Simon Laplace.

直到 17 世纪下半叶，**概率论主要被用作计算赌博赔率的方法**，与我们现在的例子类似。 它被视为一个肮脏的话题，没有被受人尊敬的数学家注意。 随着英国牧师托马斯贝叶斯的介入，这种观点开始发生变化。在这之后，随着法国数学家皮埃尔·西蒙·拉普拉斯的工作，这种观点变得更加有名（至少在当时是这样）。

They realised that it is possible to move in the opposite direction – to go from effect back to cause:  
他们意识到，可以反其道而行之 —— 从结果回到原因：
$$Pr(\text{effect}|\text{cause}) \stackrel{Bayes'thm}{\longrightarrow} Pr(\text{effect}|\text{cause})$$

### 2.4 The purpose of statistical inference 17

### 2.5 The world according to Frequentists 17

### 2.6 The world according to Bayesians 18

### 2.7 Do parameters actually exist and have a point value? 19

### 2.8 Frequentist and Bayesian inference 20

### 2.9 Bayesian inference via Bayes’ rule 23

### 2.10 Implicit versus explicit subjectivity 25

### 2.11 Chapter summary 27

### 2.12 Chapter outcomes 28

