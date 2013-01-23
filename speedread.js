'use strict';

/** @constructor */
function Page(win, doc) {
    var _win = win;
    var _doc = doc;
    var _body = doc.body;

    var _keyEvents = {};

    this.createElement = function(type) {
        return _doc.createElement(type);
    };

    this.appendChild = function(child) {
        _body.appendChild(child);
    };

    this.removeChild = function(child) {
        _body.removeChild(child);
    };

    this.addKeyEvent = function(key, action) {
        if (_body.onkeydown === null) {
            _body.onkeydown = function(evt) {
                evt = evt || _win.event;
                if (_keyEvents.hasOwnProperty(evt.keyCode)) {
                    evt.preventDefault();
                    _keyEvents[evt.keyCode]();
                }
            };
        }
        _keyEvents[key] = action;
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

function splitIntoWords(text) {
    return text.split(/\s+/);
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

    this.showWord = function(word) {
        _p.innerHTML = word;
    };
}

/** @constructor */
function WordDisplayer(words, srDialog, finished) {
    var _words = words;
    var _srDialog = srDialog;
    var _finished = finished;
    var _i = 0;

    this.nextWord = function() {
        if (_i >= _words.length) {
            _finished();
        } else {
            _srDialog.showWord(_words[_i]);
            _i += 1;
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
function SpeedReader(dialog, page) {
    var _dialog = dialog;
    var _page = page;
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
        _page.addKeyEvent(ESCAPE_KEY_CODE, function() {finish();});
        _page.addKeyEvent(SPACE_KEY_CODE, function() {pauseResume();});
    };

    this.displayWords = function(words) {
        var displayer = new WordDisplayer(words, _dialog, finish);
        _looper = new Looper(function() {displayer.nextWord();}, 255);
        _looper.start();
    };
}

function speedRead() {
    var page = new Page(window, document);
    var words = splitIntoWords(page.getSelectedText());
    if (words.length === 1 && words[0] === "") {
        return;
    }

    var elementCreator = new ElementCreator(page);
    var dialog = new SrDialog(page, elementCreator);
    dialog.create();

    var sr = new SpeedReader(dialog, page);
    sr.handKeyPresses();
    sr.displayWords(words);
}
