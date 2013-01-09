function speedRead() {
    'use strict';
    /*jslint browser: true*/

    function getSelectionHtml() {
        var html = '', sel, container, i, len;
        if (window.getSelection !== undefined) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                container = document.createElement('div');
                for (i = 0, len = sel.rangeCount; i < len; i += 1) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (document.selection !== undefined) {
            if (document.selection.type === Text) {
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
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
        var newBody = document.createElement('body'), p;
        p = document.createElement('p');
        p.style.cssText = 'text-align: left !important; background-color: white !important; color: black !important; font-size: 40px !important; margin: 20px !important;';
        p.appendChild(document.createTextNode(word));
        newBody.appendChild(p);
        document.body.innerHTML = newBody.innerHTML;
    }

    function displayWords(words) {
        var i = 0, oldBody, interval;
        oldBody = document.body.innerHTML;
        interval = setInterval(function () {
            if (i >= words.length) {
                clearInterval(interval);
                document.body.innerHTML = oldBody;
            } else {
                displayWord(words[i]);
                i += 1;
            }
        }, 150);
    }

    displayWords(splitIntoWords(strip(getSelectionHtml)));
}
