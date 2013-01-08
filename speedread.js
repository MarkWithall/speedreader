function speedRead()
{
    var html = getSelectionHtml();
    var text = strip(html);
    var words = splitIntoWords(text);
    displayWords(words);

    function getSelectionHtml() {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        return html;
    }

    function strip(html)
    {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent||tmp.innerText;
    }

    function splitIntoWords(text)
    {
        return text.split(" ");
    }

    function displayWords(words)
    {
        var i = 0;
        var oldBody = document.body.innerHTML;
        var interval = setInterval(function() {
            if (i >= words.length) {
                clearInterval(interval);
                document.body.innerHTML = oldBody;
            } else {
                displayWord(words[i]);
                i++;
            }
        }, 150);
    }

    function displayWord(word)
    {
        var newBody = document.createElement('body');
        var p = document.createElement('p');
        p.style.cssText = "color: black !important; font-size: 40px !important; margin: 20px !important;";
        p.appendChild(document.createTextNode(word));
        newBody.appendChild(p);
        document.body.innerHTML = newBody.innerHTML;
    }
}
