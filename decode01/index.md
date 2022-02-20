# Decode Real-World Examples in Python | Educative.io Course Notes


> Building simple features and understand the underlying patterns that can be applied to real-world examples
>
> - Create in 2022.02.14. Monday; Finish Feature 1 of Netflix

### 1. Netflix Features

Netflix is the biggest video streaming platform in the world, offering movies, seasons, biographies, reality shows, and more.

- Their video repository is growing significantly. So the engineering team at Netflix keeps trying to find better ways to display content to their consumers.
- Goal: improving the user experience in finding content to watch.
  - This involves the improvement of the search as well as recommendation functionality.

8 Features:

- Group Similar Titles: enable users to see relevant search results despite minor typos.
- Fetch Top Movies: Enable the user to view the top-rated movies worldwide, given that we have movie rankings available separately for different geographic regions.
- Find Median Age
- Popularity Analysis
- Fetch Most Recently Watched Titles
- Fetch Most Frequently Watchend Titles
- Browse Ratings
- Verify Session

#### 1.1. Feature 1: Group Similar Titles with Typos

Question: How would we efficiently implement a functionality so that if a user misspells `speed` as `spede`, they are shown the correct title?

- We want to _split the list of titles_ into sets of words so that _all words in a set are anagrams_.
  - `["duel", "dule", "speed", "spede", "deul", "cars"]` ==> `{"duel", "dule", "deul"}, {"speed", "spede"}, and {"cars"}`

**Solution：**

For each title, compute a `26-element vector`. Each element in this vector represents `the frequency of an English letter` in the corresponding title.

- This frequency count will be represented as a `tuple`.
- For example, `abbccc` will be represented as `(1, 2, 3, 0, 0, ..., 0)`.
- This mapping will generate identical vectors for strings that are anagrams.

Use _this vector_ as a `key` to insert the titles into a `Hash Map`.

- All _anagrams_ will be mapped to the same entry in this Hash Map.
- When a user searches a word, compute the _26-element English letter frequency vector_ based on the word.
- Search in the Hash Map using this vector and return all the map entries.

```python


```

**Complexity:**
Time: `O(n x k)`, n is the size of the list of strings, k is the maximum length that a single string can have

Space:

