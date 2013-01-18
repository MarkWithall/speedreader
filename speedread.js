'use strict';

function getSelectionText() {
    if (window.getSelection) {
        return window.getSelection();
    }
    if (document.getSelection) {
        return document.getSelection();
    }
    if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}

function strip(html) {
    var tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
}

function splitIntoWords(text) {
    return text.split(/\s+/);
}

function ElementCreator() {
    var create = function(type, id, css) {
        var elem = document.createElement(type);
        elem.id = id;
        for (var property in css) {
            elem.style[property] = css[property];
        }
        return elem;
    };

    this.createDiv = function(id, css) {
        return create('div', id, css);
    };

    this.createPara = function(id, css) {
        return create('p', id, css);
    };
}

function SrDialog() {
    var _dialog = null;
    var _p = null;

    this.create = function() {
        var creator = new ElementCreator();

        _dialog = creator.createDiv('srDialog', {
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
        _p = creator.createPara('srWord', {
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

        _p.innerText = '';
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
        _p.innerText = word;
    };
}

function WordDisplayer(words, srDialog, finished) {
    var _words = words;
    var _srDialog = srDialog;
    var _finished = finished;
    var _i = 0;

    this.nextWord = function() {
        if (_i >= _words.length) {
            finished();
        } else {
            _srDialog.showWord(_words[_i]);
            _i += 1;
        }
    };
}

function handleKeyPresses(interval, displayer, srDialog) {
    var playing = true;
    var ESCAPE_KEY_CODE = 27;
    var SPACE_KEY_CODE = 32;
    document.body.onkeydown = function(evt) {
        if (window.event.keyCode === ESCAPE_KEY_CODE) {
            evt.preventDefault(); /* stop Mac Safari exiting full screen */
            clearInterval(interval);
            srDialog.remove();
        }
        else if (window.event.keyCode === SPACE_KEY_CODE) {
            evt.preventDefault();
            if (playing) {
                clearInterval(interval);
                playing = false;
            } else {
                interval = setInterval(function() {displayer.nextWord();}, 225);
                playing = true;
            }
        }
    };
}

function displayWords(words) {
    if (words.length === 1 && words[0] === "") {
        return;
    }
    var srDialog = new SrDialog();
    srDialog.create();
    var interval;
    var displayer = new WordDisplayer(words, srDialog, function() {clearInterval(interval); srDialog.remove();});
    interval = setInterval(function() {displayer.nextWord();}, 225);
    handleKeyPresses(interval, displayer, srDialog);
}

function speedRead() {
    displayWords(splitIntoWords(strip(getSelectionText())));
}
