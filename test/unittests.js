// Generated by CoffeeScript 1.6.2
var createText, removeText, selectText;

createText = function() {
  var header, para, testContent;

  testContent = document.createElement('div');
  testContent.id = 'testContent';
  header = document.createElement('h1');
  para = document.createElement('p');
  header.innerHTML = 'Test content';
  para.innerHTML = 'This is a test!';
  testContent.appendChild(header);
  testContent.appendChild(para);
  return document.body.appendChild(testContent);
};

removeText = function() {
  var testContent;

  testContent = document.getElementById('testContent');
  if (testContent !== null) {
    return document.body.removeChild(testContent);
  }
};

selectText = function(element) {
  var doc, range, selection, text;

  doc = document;
  text = doc.getElementById(element, range, selection);
  if (doc.body.createTextRange) {
    range = doc.body.createTextRange();
    range.moveToElementText(text);
    return range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = doc.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    return selection.addRange(range);
  }
};

module('Page');

test('simpleSelection', function() {
  var result;

  createText();
  selectText('testContent');
  result = new Page(window, document).getSelectedText();
  notEqual(result.indexOf("Test content", 0), -1);
  notEqual(result.indexOf("This is a test!", 0), -1);
  return removeText();
});

module('splitIntoWords');

test('simpleTest', function() {
  var result;

  result = splitIntoWords("a b c d");
  return deepEqual(result, ['a', 'b', 'c', 'd']);
});

module('SrDialog');

test('keypress', function() {
  var SPACE_KEY_CODE, dialog, evt, page, spaceDetected;

  page = new Page(window, document);
  dialog = new SrDialog(page, new ElementCreator(page));
  dialog.create();
  SPACE_KEY_CODE = 32;
  spaceDetected = false;
  dialog.addKeyEvent(SPACE_KEY_CODE, function() {
    spaceDetected = true;
  });
  evt = jQuery.Event("keydown");
  evt.keyCode = SPACE_KEY_CODE;
  $("#srDialog").trigger(evt);
  dialog.remove();
  ok(spaceDetected);
  return dialog.clearKeyEvents();
});

module('splitIntoSentences');

test('basicSplit', function() {
  var expectedOutput, input, result;

  input = "This is a test. Is a test! A test?";
  expectedOutput = [['This', 'is', 'a', 'test.', ''], ['Is', 'a', 'test!', ''], ['A', 'test?', '']];
  result = splitIntoSentences(input);
  return deepEqual(result, expectedOutput);
});

test('advancedSplit', function() {
  var expectedOutput, input, result;

  input = 'This is test. "Still a test!" More test???';
  expectedOutput = [['This', 'is', 'test.', ''], ['"Still', 'a', 'test!"', ''], ['More', 'test???', '']];
  result = splitIntoSentences(input);
  return deepEqual(result, expectedOutput);
});

test('emptyString', function() {
  var result;

  result = splitIntoSentences('');
  return deepEqual(result, []);
});
