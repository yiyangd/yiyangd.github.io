# Paper Notes 00 | How to Read a Paper


## PaperNotes00 ｜ How to Read a Paper

> 此篇笔记是**PaperNotes**系列的第 1 篇，我将*S. Keshav*教授在 2016 年写作的**How to Read a Paper** 进行*摘抄，翻译和要点总结*：
>
> - http://blizzard.cs.uwaterloo.ca/keshav/home/Papers/data/07/paper-reading.pdf

{{< figure src="/images/papers/paper00.png" width="400">}}

### ABSTRACT

Researchers spend a great deal of time reading research papers. However, this skill is rarely taught, leading to much
wasted effort.

- This article **outlines a practical and efficient three-pass method** for reading research papers.
- I also describe _how to use this method to do a literature survey._

### 1. INTRODUCTION

**段落 1: 读论文的原因和平均时间**  
Researchers must read papers for _several reasons_:

- to review them for a conference or a class,
- to keep current in their field,
- or for a literature survey of a new field.

A typical researcher _will likely spend hundreds of hours_ every year
reading papers.

**段落 2: 起步阶段的研究生需要主动尝试和犯错**  
Learning to efficiently read a paper is a critical but rarely
taught skill.

- _Beginning graduate students_, therefore, must learn on their own **using trial and error**. （主动尝试和犯错）
- Students waste much effort in the process and are frequently driven to frustration.

**段落 3: 这篇行动指南的意义和目的**  
For many years I have used a **simple ‘three-pass’ approach** to prevent me from drowning in the details of a paper before getting a bird’s-eye-view. （先有纵览再深入细节）

- It allows me to _estimate the amount of time_ required to review a set of papers.
- Moreover, I can _adjust the depth of paper evaluation_ depending on my needs and how much time I have.
- This paper describes the approach and its use in doing a literature survey.

### 2. THE THREE-PASS APPROACH

The key idea is that you should read the paper in up to three passes, ~~instead of starting at the beginning and plowing your way to the end~~. （不要从头读到尾）

- Each pass accomplishes specific goals and builds upon the previous pass:
  - The first pass gives you a general idea about the paper.
  - The second pass lets you grasp the paper’s content, but not its details.
  - The third pass helps you understand the paper in depth.

#### 2.1 The first pass

**段落 1: 五到十分钟, 五个步骤, 五个问题**  
The **first pass** is a _quick scan to get a bird’s-eye view_ of the paper. You can also decide whether you need to do any more passes.

- This pass should take about **five to ten minutes** and consists of the following steps:

1. Carefully _read the title, abstract, and introduction_

- 第一步先读论文的题目, 概要，和介绍

2. Read the _section and sub-section headings_, but ignore everything else

- 第二步读论文的章节题目

3. Glance at the _mathematical content_ (if any) to determine the underlying theoretical foundations

- 第三步浏览一下数学

4. Read the conclusions

- 第四步读结论

5. Glance over the references, mentally ticking off (☑️) the ones you’ve already read

- 第五步读参考文献，读过的打勾

At the end of the first pass, you should be able to _answer the five Cs :_

1. **Category:** What type of paper is this? A _measurement_ paper? An _analysis_ of an existing system? A _description_ of a research prototype?
2. **Context:** Which other papers is it related to? Which theoretical bases were used to analyze the problem?
3. **Correctness:** Do the assumptions appear to be valid?
4. **Contributions:** What are the paper’s main contributions?
5. **Clarity:** Is the paper well written?

**段落 2: 通过 first pass 进行取舍**  
Using this information, you may choose not to read further (and not print it out, thus saving trees).

- This could be because the paper doesn’t interest you, or you don’t know enough about the area to understand the paper, or that the authors make invalid assumptions.
- The first pass is adequate for papers that aren’t in your research area, but may someday prove relevant.

**段落 3: 视角转换**  
Incidentally, when you write a paper, _you can expect most reviewers (and readers) to make only one pass over it_.

- Take care to choose coherent section and sub-section titles and to write concise and comprehensive abstracts.
- _If a reviewer cannot understand the gist after one pass, the paper will likely be rejected_; if a reader cannot understand the highlights of the paper after five minutes, the paper will likely never be read.
- For these reasons, _a ‘graphical abstract’ that summarizes a paper_ with a single well-chosen figure is an excellent idea and can be increasingly found in scientific journals.

#### 2.2. The second pass

**段落 1: 记录要点，暂略细节**  
In the second pass, read the paper with greater care, _but ignore details such as proofs_.

- It helps to _jot down the key points_, or to make comments in the margins, as you read.
- Dominik Grusemann from Uni Augsburg suggests that you “note down terms you didn’t understand, or questions you may want to ask the author.”
- If you are acting as a paper referee, these comments will help you when you are writing your review, and to back up your review during the program committee meeting.

1. **Look carefully at the figures**, diagrams and other illustrations in the paper.

- Pay special attention to graphs. Are the axes properly labeled? Are results shown with error bars, so that conclusions are _statistically significant_? Common mistakes like these will separate rushed, shoddy work from the truly excellent.

2. Remember to mark relevant unread references for further reading (this is a good way to learn more about the background of the paper).

**段落 2: 梳理主线**  
The second pass should _take up to an hour_ for an experienced reader.

- After this pass, you should be able to _grasp the content_ of the paper.
- You should be able to _summarize the main thrust_ of the paper, with supporting evidence, to someone else.
- _This level of detail is appropriate_ for a paper in which you are interested, but does not lie in your research speciality.

**段落 3: 仍无法理解论文的原因**  
Sometimes you won’t understand a paper even at the end of the second pass.

- This may be because _the subject matter is new_ to you, _with unfamiliar terminology_ and acronyms.
- Or the authors may use a proof or experimental technique that you don’t understand, so that the bulk of the paper is incomprehensible(费解的).
- The paper may be poorly written with unsubstantiated assertions and numerous forward references.
- Or _it could just be that it’s late at night and you’re tired_. You can now choose to:
  - (a) set the paper aside, hoping you don’t need to understand the material to be successful in your career,
  - (b) return to the paper later, perhaps after reading background material or
  - (c) _persevere and go on to the third pass._

#### 2.3. The third pass

**段落 1: 尝试复现论文，验证假设**  
To fully understand a paper, particularly if you are a reviewer, requires a third pass.

- The key to the third pass is to attempt to _virtually re-implement the paper_:
  - that is, making the same assumptions as the authors,
  - re-create the work.
- By comparing this re-creation with the actual paper, you can easily identify not only a paper’s innovations, but also its hidden failings and assumptions.

**段落 2: 专注细节**  
This pass requires great attention to detail.

- You should identify and challenge every assumption in every statement.
- Moreover, you should _think about how you yourself would present a particular idea_.
- This comparison of the actual with the virtual _lends a sharp insight into the proof and presentation techniques_ in the paper and you can very likely _add this to your repertoire of tools_.
- During this pass, you should also jot down ideas for future work.

**段落 3: 三步法的最终目的**  
This pass can take **many hours for beginners（！！！）** and more than an hour or two even for an experienced reader.

- At the end of this pass, you should be able to _reconstruct the entire structure of the paper_ from memory, as well as be able to _identify its strong and weak points_.
- In particular, you should be able to _pinpoint_ implicit assumptions, missing citations to relevant work, and potential issues with experimental or analytical techniques.

### 3. DOING A LITERATURE SURVEY

**段落 1: 用三步法进行文献综述**  
Paper reading skills are put to the test in _doing a literature survey_.

- This will require you to **read tens of papers**, perhaps in an unfamiliar field.
- What papers should you read? Here is _how you can use the three-pass approach to help_.

**段落 2: 搜索相关论文和综述**  
First, use an academic search engine such as **Google Scholar** or **CiteSeer** and some well-chosen keywords _to find three to five recent highly-cited papers_ in the area.

- Do **one pass** on each paper to get a sense of the work, then read their related work sections.
- You will _find a thumbnail summary of the recent work_, and perhaps, if you are lucky, a pointer to a recent survey paper.
- If you can find such a survey, you are done. Read the survey, **congratulating yourself on your good luck.**

**段落 3+4: 找到顶级研究员和会议**  
Otherwise, **in the second step**, find shared citations and repeated author names in the bibliography.

- These are the key papers and researchers in that area.
- Download the key papers and set them aside.
- Then go to the websites of the key researchers and see where they’ve published recently.
- That will help you identify the top conferences in that field because the best researchers usually publish in the top conferences.

The **third step** is to go to the website for these top conferences and look through their recent proceedings.

- A quick scan will usually _identify recent high-quality related work_.
- These papers, along with the ones you set aside earlier, constitute the first version of your survey.
- _Make two passes_ through these papers. If they all cite a key paper that you did not find earlier, obtain and read it, iterating as necessary.

### 4. RELATED WORK

**段落 1+2: 相关工作和参考**  
If you are reading a paper to do a review, you should also read Timothy Roscoe’s paper on _“Writing reviews for systems conferences” [3]_.

- If you’re planning to write a technical paper, you should refer both to Henning Schulzrinne’s comprehensive web site [4] and George Whitesides’s excellent overview of the process [5].
- Finally, Simon Peyton Jones has a website that covers the entire spectrum of research skills [2].

Iain H. McLean of Psychology, Inc. has put together a downloadable ‘review matrix’ that simplifies paper reviewing using the three-pass approach for papers in experimental psychology[1], which can probably be used, with minor modifications, for papers in other areas.

### 5. ACKNOWLEDGEMENT

**段落 1+2: 致谢**  
The first version of this document was drafted by my students: Hossein Falaki, Earl Oliver, and Sumair Ur Rahman. My thanks to them. I also benefited from Christophe Diot’s perceptive comments and Nicole Keshav’s eagle-eyed copyediting.

I would like to make this a living document, updating it as I receive comments. Please take a moment to email me any comments or suggestions for improvement. Thanks to encouraging feedback from many correspondents over the years.

### 6. REFERENCES

[1] I.H. McLean, “Literature Review Matrix,” http://psychologyinc.blogspot.com/  
[2] S. Peyton Jones, “Research Skills,” http://research.microsoft.com/en- us/um/people/simonpj/papers/giving-a-talk/giving-a- talk.htm  
[3] T. Roscoe, “Writing Reviews for Systems Conferences,” http://people.inf.ethz.ch/troscoe/pubs/review-writing.pdf  
[4] H. Schulzrinne, “Writing Technical Articles,” http://www.cs.columbia.edu/∼hgs/etc/writing-style.html  
[5] G.M. Whitesides, “Whitesides’ Group: Writing a Paper,”
http://www.ee.ucr.edu/∼rlake/Whitesides writing res paper.pdf

