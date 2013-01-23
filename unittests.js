function selectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

module('getSelectionText');

test('simpleSelection', function() {
    selectText('testContent');
    var result = new Page(window, document).getSelectedText();
    notEqual(result.indexOf("Test content"), -1);
    notEqual(result.indexOf("This is a test!"), -1);
});

module('splitIntoWords');

test('simpleTest', function() {
    var result = splitIntoWords("a b c d");
    deepEqual(result, ['a', 'b', 'c', 'd']);
});
