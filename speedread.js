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

function SrDialog() {
    this.dialog = null;
    this.p = null;

    this.create = function() {
        this.dialog = document.createElement('div');
        this.dialog.id = 'srDialog';
        this.dialog.style.cssText = 'background-color: white; opacity: .95; filter: alpha(opacity=95); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000;';

        this.p = document.createElement('p');
        this.p.id = 'srWord';
        /* NOTE: percentages need to be changed to e.g. 100%25 for inline bookmarklets! */
        this.p.style.cssText = 'text-align: center; background-color: white; color: black; font-size: 40px; position: fixed; top: 50%; left: 50%; width: 400px; margin-left: -200px; height: 100px; margin-top: -50px;';
        this.p.innerText = '';
        this.dialog.appendChild(this.p);

        document.body.appendChild(this.dialog);
        this.dialog.focus();
    };

    this.remove = function() {
        if (this.dialog !== null) {
            document.body.removeChild(this.dialog);
        }
    };

    this.showWord = function(word) {
        this.p.innerText = word;
    };
}

function WordDisplayer(words, srDialog, finished) {
    this.words = words;
    this.srDialog = srDialog;
    this.finished = finished;
    this.i = 0;

    this.nextWord = function() {
        if (this.i >= this.words.length) {
            this.finished();
        } else {
            this.srDialog.showWord(this.words[this.i]);
            this.i += 1;
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
