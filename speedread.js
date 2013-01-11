function speedRead() {
    'use strict';
    /*jslint browser: true*/

    var interval;

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
        return text.split(' ');
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

    function closeDialogOnEsc() {
        document.body.onkeydown = function(evt) {
            if (window.event.keyCode == 27) {
                evt.preventDefault(); /* stop Mac Safari exiting full screen */
                clearInterval(interval);
                removeDialog();
            }
        }
    }

    function createDialog() {
        var srDialog = document.createElement('div');
        srDialog.id = 'srDialog';
        srDialog.style.cssText = 'background-color: white; opacity: .95; filter: alpha(opacity=95); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000;';
        document.body.appendChild(srDialog);
        srDialog.focus();
        closeDialogOnEsc();
    }

    function removeDialog() {
        var srDialog = document.getElementById('srDialog');
        if (srDialog != null) {
            document.body.removeChild(srDialog);
        }
    }

    function displayWords(words) {
        var i = 0;
        createDialog();
        interval = setInterval(function () {
            if (i >= words.length) {
                clearInterval(interval);
                removeDialog();
            } else {
                displayWord(words[i]);
                i += 1;
            }
        }, 225);
    }

    displayWords(splitIntoWords(strip(getSelectionText())));
}
