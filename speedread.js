'use strict';
/*jslint browser: true*/

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

function displayWord(word) {
    var srDialog = document.getElementById('srDialog'), p, oldWord;
    oldWord = document.getElementById('srWord');
    if (oldWord !== null) {
        srDialog.removeChild(oldWord);
    }
    p = document.createElement('p');
    p.id = 'srWord';
    /* NOTE: percentages need to be e.g. 100%25 in bookmarklets! */
    p.style.cssText = 'text-align: center; background-color: white; color: black; font-size: 40px; position: fixed; top: 50%; left: 50%; width: 400px; margin-left: -200px; height: 100px; margin-top: -50px;';
    p.appendChild(document.createTextNode(word));
    srDialog.appendChild(p);
}

function createDialog() {
    var srDialog = document.createElement('div');
    srDialog.id = 'srDialog';
    srDialog.style.cssText = 'background-color: white; opacity: .95; filter: alpha(opacity=95); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000;';
    document.body.appendChild(srDialog);
    srDialog.focus();
}

function removeDialog() {
    var srDialog = document.getElementById('srDialog');
    if (srDialog !== null) {
        document.body.removeChild(srDialog);
    }
}

var i = 0;

function handleKeyPresses(interval, words) {
    var playing = true;
    var ESCAPE_KEY_CODE = 27;
    var SPACE_KEY_CODE = 32;
    document.body.onkeydown = function(evt) {
        if (window.event.keyCode === ESCAPE_KEY_CODE) {
            evt.preventDefault(); /* stop Mac Safari exiting full screen */
            clearInterval(interval);
            removeDialog();
        }
        else if (window.event.keyCode === SPACE_KEY_CODE) {
            evt.preventDefault();
            if (playing) {
                clearInterval(interval);
                playing = false;
            } else {
                interval = setInterval(function () {
                    if (i >= words.length) {
                        clearInterval(interval);
                        removeDialog();
                    } else {
                        displayWord(words[i]);
                        i += 1;
                    }
                }, 225);
                playing = true;
            }
        }
    }
}

function displayWords(words) {
    createDialog();
    var interval = setInterval(function () {
        if (i >= words.length) {
            clearInterval(interval);
            removeDialog();
        } else {
            displayWord(words[i]);
            i += 1;
        }
    }, 225);
    handleKeyPresses(interval, words);
}

function speedRead() {
    displayWords(splitIntoWords(strip(getSelectionText())));
}
