'use strict';

function getSelectionText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    }
    if (document.getSelection) {
        return document.getSelection();
    }
    if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}

function splitIntoWords(text) {
    return text.split(/\s+/);
}

var ElementCreator = (function() {
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
        var elem = document.createElement(type);
        elem.id = id;
        elem.style.cssText = createCssText(css);
        return elem;
    };

    return {
        createDiv: function(id, css) {
            return create('div', id, css);
        },

        createPara: function(id, css) {
            return create('p', id, css);
        }
    };
})();

/** @constructor */
function SrDialog() {
    var _dialog = null;
    var _p = null;

    this.create = function() {
        _dialog = ElementCreator.createDiv('srDialog', {
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
        _p = ElementCreator.createPara('srWord', {
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
        document.body.appendChild(_dialog);
        _dialog.focus();
    };

    this.remove = function() {
        if (_dialog !== null) {
            document.body.removeChild(_dialog);
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
        document.body.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode === ESCAPE_KEY_CODE) {
                evt.preventDefault(); /* stop Mac Safari exiting full screen */
                finish();
            } else if (evt.keyCode === SPACE_KEY_CODE) {
                evt.preventDefault(); /* stop Mac Safari exiting full screen */
                pauseResume();
            }
        };
    };

    this.displayWords = function(words) {
        var displayer = new WordDisplayer(words, _dialog, finish);
        _looper = new Looper(function() {displayer.nextWord();}, 255);
        _looper.start();
    };
}

function speedRead() {
    var words = splitIntoWords(getSelectionText());
    if (words.length === 1 && words[0] === "") {
        return;
    }

    var dialog = new SrDialog();
    dialog.create();

    var sr = new SpeedReader(dialog);
    sr.handKeyPresses();
    sr.displayWords(words);
}
