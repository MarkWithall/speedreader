if exports?
    sr = require '../speedread'
    Splitter = sr.Splitter
else
    Splitter = window.Splitter

describe 'Splitter', =>
    it 'splits space-separated letters into list of letters', =>
        result = Splitter.splitIntoWords "a b c d"
        expect(result).toEqual ['a', 'b', 'c', 'd']

    it 'splits simple paragraph into sentences of words', =>
        input = "This is a test. Is a test! A test?"
        expectedOutput = [ \
            ['This', 'is', 'a', 'test.', '' ], \
            ['Is', 'a', 'test!', ''], \
            ['A', 'test?', ''] ]
        result = Splitter.splitIntoSentences input
        expect(result).toEqual expectedOutput

    it 'splits quoted text and multi-character punctuation correctly', =>
        input = 'This is test. "Still a test!" More test???'
        expectedOutput = [ \
            ['This', 'is', 'test.', ''], \
            ['"Still', 'a', 'test!"', ''], \
            ['More', 'test???', ''] ]
        result = Splitter.splitIntoSentences input
        expect(result).toEqual expectedOutput

    it 'splits empty string into empty list of words', =>
        result = Splitter.splitIntoSentences ''
        expect(result).toEqual [ ]


