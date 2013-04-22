if document.getElementById('speedReaderScript') is null
    s = document.createElement 'script'
    s.id = 'speedReaderScript'
    s.src = 'http://markwithall.github.com/speedreader/build/speedread-mini.js'
    s.type = 'text/javascript'
    document.body.appendChild s
else
    speedRead window, 350

