# OpenCV Notes 01 | Feature Detection


### 0. Understanding Features

#### Jigsaw Puzzle Game

Most of you will have played the jigsaw puzzle games. You get a lot of small pieces of an image, where you need to assemble them correctly to form a big real image.

- If the computer can play jigsaw puzzles, why can't we give a lot of real-life images of a good natural scenery to computer and tell it to stitch all those images to a big single image?
- If the computer can stitch several natural images to one, what about giving a lot of pictures of a building or any structure and tell computer to _create a 3D model_ out of it?

#### Basic Questions

- How do you play jigsaw puzzles?
- How do you arrange lots of scrambled image pieces into a big single image?
- How can you stitch a lot of natural images to a single image?

Answers:

- We are looking for _specific patterns_ or _specific features_ which are **unique**, can be easily tracked and can be easily compared.
- 好的 Feature 难以被定义，但小孩子都可以做到 —— 那便是拼拼图先去拼的那四个角，边和独特的拼图块块。

#### Feature Detection

- looks for the features in images which have maximum variation when moved (by a small amount) in all regions around it.

#### Feature Description

- We take a region around the feature, we explain it in our own words,
- like "upper part is blue sky, lower part is region from a building, on that building there is glass etc"
- Once you have the features and its description, you can find same features in all images and align them, stitch them together

### 1.

Reference:

- https://docs.opencv.org/4.x/db/d27/tutorial_py_table_of_contents_feature2d.html
- https://docs.opencv.org/4.x/df/d54/tutorial_py_features_meaning.html

