function createText() {
    var testContent = document.createElement('div');
    testContent.id = 'testContent';
    var header = document.createElement('h1');
    var para = document.createElement('p');
    header.innerHTML = 'Test content';
    para.innerHTML = 'This is a test!';
    testContent.appendChild(header);
    testContent.appendChild(para);
    document.body.appendChild(testContent);
}

function removeText() {
    var testContent = document.getElementById('testContent');
    if (testContent !== null) {
        document.body.removeChild(testContent);
    }
}

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
    createText();
    selectText('testContent');
    var result = new Page(window, document).getSelectedText();
    notEqual(result.indexOf("Test content"), -1);
    notEqual(result.indexOf("This is a test!"), -1);
    removeText();
});

module('splitIntoWords');

test('simpleTest', function() {
    var result = splitIntoWords("a b c d");
    deepEqual(result, ['a', 'b', 'c', 'd']);
});
