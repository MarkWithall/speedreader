'use strict';

/** @constructor */
function Page(win, doc) {
    var _win = win;
    var _doc = doc;
    var _body = doc.body;

    this.createElement = function(type) {
        return _doc.createElement(type);
    };

    this.appendChild = function(child) {
        _body.appendChild(child);
    };

    this.removeChild = function(child) {
        _body.removeChild(child);
    };

   this.getSelectedText = function() {
        if (_win.getSelection) {
            return _win.getSelection().toString();
        }
        if (_doc.getSelection) {
            return _doc.getSelection();
        }
        if (_doc.selection) {
            return _doc.selection.createRange().text;
        }
        return '';
    };
}

var stringReverse = function(str) {
    return str.split('').reverse().join('');
};

function stringNotEmpty(str) {
    return str != '';
}

var splitIntoWords = function(text) {
    return text.split(/\s+/).filter(stringNotEmpty);
};

function arrayNotEmpty(array) {
    return array.length > 0;
}

function appendEmptyElement(array) {
    return array.concat('');
}

var splitIntoSentences = function(text) {
    return stringReverse(text)
             .split(/(?=[\s\n\r]+["']?[.?!]+)/)
             .map(stringReverse)
             .reverse()
             .map(splitIntoWords)
             .filter(arrayNotEmpty)
             .map(appendEmptyElement)
};

/** @constructor */
function TextSplitter(sentences) {
    var _sentences = sentences;
    var _sentence = 0;
    var _word = 0;

    this.hasNext = function() {
        return _sentence < _sentences.length;
    }

    this.nextWord = function() {
        var nextWord = _sentences[_sentence][_word];
        _word += 1;
        if (_word == _sentences[_sentence].length) {
            _word = 0;
            _sentence += 1;
        }
        return nextWord;
    };
}

/** @constructor */
function ElementCreator(page) {
    var _page = page;

    var createCssText = function(css) {
        var cssText = '';
        for (var property in css) {
            if (css.hasOwnProperty(property)) {
                cssText += property + ': ' + css[property] + ';';
            }
        }
        return cssText; 
    };

    var create = function(type, id, css) {
        var elem = _page.createElement(type);
        elem.id = id;
        elem.style.cssText = createCssText(css);
        return elem;
    };

    this.createDiv = function(id, css) {
        return create('div', id, css);
    };

    this.createPara = function(id, css) {
        return create('p', id, css);
    };
}

/** @constructor */
function SrDialog(page, elementCreator) {
    var _page = page;
    var _elementCreator = elementCreator;
    var _dialog = null;
    var _p = null;
    var _keyEvents = {};

    this.create = function() {
        _dialog = _elementCreator.createDiv('srDialog', {
            'background-color': 'white',
            'opacity': '.95',
            'filter': 'alpha(opacity=95)',
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'z-index': '1000'
        });

        /* NOTE: a div must have a tabindex to be able to attach onkeydown */
        _dialog.tabIndex = 0;

        /* NOTE: percentages need to be changed to e.g. 100%25 for inline bookmarklets! */
        _p = _elementCreator.createPara('srWord', {
            'text-align': 'center',
            'background-color': 'white',
            'color': 'black',
            'font-size': '40px',
            'position': 'fixed',
            'top': '50%',
            'left': '50%',
            'width': '400px',
            'margin-left': '-200px',
            'height': '100px',
            'margin-top': '-50px'
        });

        _p.innerHTML = '';
        _dialog.appendChild(_p);
        _page.appendChild(_dialog);
        _dialog.focus();
    };

    this.remove = function() {
        if (_dialog !== null) {
            _page.removeChild(_dialog);
        }
    };

    this.addKeyEvent = function(key, action) {
        if (_dialog.onkeydown === null) {
            _dialog.onkeydown = function(evt) {
                evt = evt || _win.event;
                if (_keyEvents.hasOwnProperty(evt.keyCode)) {
                    evt.preventDefault();
                    _keyEvents[evt.keyCode]();
                }
            };
        }
        _keyEvents[key] = action;
    };
 
    this.showWord = function(word) {
        _p.innerHTML = word;
    };
}

/** @constructor */
function WordDisplayer(words, srDialog, finished) {
    var _words = words;
    var _srDialog = srDialog;
    var _finished = finished;

    this.nextWord = function() {
        if (_words.hasNext()) {
            _srDialog.showWord(_words.nextWord());
        } else {
            _finished();
        }
    };
}

/** @constructor */
function Looper(callback, time) {
    var _callback = callback;
    var _time = time;
    var _interval = null;

    this.start = function() {
        _interval = setInterval(_callback, _time);
    };

    this.stop = function() {
        clearInterval(_interval);
    };
}

/** @constructor */
function SpeedReader(dialog) {
    var _dialog = dialog;
    var _looper = null;
    var _playing = true;
    var ESCAPE_KEY_CODE = 27;
    var SPACE_KEY_CODE = 32;

    var finish = function() {
        _looper.stop();
        _dialog.remove();
    };

    var pauseResume = function() {
        if (_playing) {
            _looper.stop();
        } else {
            _looper.start();
        }
        _playing = !_playing;
    };

    this.handKeyPresses = function() {
        _dialog.addKeyEvent(ESCAPE_KEY_CODE, function() {finish();});
        _dialog.addKeyEvent(SPACE_KEY_CODE, function() {pauseResume();});
    };

    this.displayWords = function(words) {
        var displayer = new WordDisplayer(words, _dialog, finish);
        _looper = new Looper(function() {displayer.nextWord();}, 255);
        _looper.start();
    };
}

function speedRead() {
    var page = new Page(window, document);
    var sentences = splitIntoSentences(page.getSelectedText());
    if (sentences.length == 0) {
        return;
    }
    var words = new TextSplitter(sentences);

    var elementCreator = new ElementCreator(page);
    var dialog = new SrDialog(page, elementCreator);
    dialog.create();

    var sr = new SpeedReader(dialog);
    sr.handKeyPresses();
    sr.displayWords(words);
}
