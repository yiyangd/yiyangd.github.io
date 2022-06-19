# Deep Learning Notes | Word Embedding


## 自然语言处理：为文字建立统计模型

### 0. Sequence Data

Many data sources are _sequential_ in nature, and call for special treatment when building predictive models:

- Documents such as books and movie reviews, newspaper articles, and tweets
  - The sequence and relative positions of words in a document capture the narrative, theme and tone,
  - tasks: topic classification, sentiment analysis, and language translation.
- Time Series of weather and finantial information
  - tasks: weather / market indices prediction
- Recorded Speech and Sound Recordings
  - tasks: text transcription of a speech, or music generation

A sentence can be represented as a sequence of L words, include slang or non-words, have spelling errors. The simplest and most common featurization is the **bag-of-words** model

- score each text for the presence or absence of each of the words in a language dictionary
- given a Language Dictionary that contains 10000 most frequently occuring words

```python
from keras.preprocessing.text import Tokenizer

sentence = ["John likes to watch movies. Mary likes movies too."]

def print_bow(sentence) -> None:
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(sentence)
    sequences = tokenizer.texts_to_sequences(sentence)
    word_index = tokenizer.word_index
    bow = {}
    for key in word_index:
        bow[key] = sequences[0].count(word_index[key])

    print(f"Bag of word sentence 1:\n{bow}")
    print(f'We found {len(word_index)} unique tokens.')

print_bow(sentence)
'''
Bag of word sentence 1:
{'likes': 2, 'movies': 2, 'john': 1, 'to': 1, 'watch': 1, 'mary': 1, 'too': 1}

We found 7 unique tokens.
'''
```

### 1. Word Representation

The One-Hot Representation is simple

- however, it has NO information about its relationship to other one-hot-encoded vector
- Solution: Create a Matrix of Features to describe the words
  - Word Embeddings!

Two Pretrained Embeddings are widely used:

- `word2vec`
- `GloVe`

### Use

