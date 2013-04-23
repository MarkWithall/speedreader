if exports?
    sr = require '../speedread'

class FakeWin
    setInterval: (c, t) ->
    clearInterval: (i) ->
    document:
        createElement: (t) ->
        body:
            appendChild: (c) ->
            removeChild: (c) ->
    event: null

describe 'Page', =>
    win = null
    page = null
    beforeEach () ->
        win = new FakeWin()
        page = new sr.Page(win)
    it 'passes createElement through to window.createElement', =>
        spyOn win.document, 'createElement'
        page.createElement 1
        expect(win.document.createElement).toHaveBeenCalledWith 1
    it 'passes appendChild through to window.document.body.appendChild', =>
        spyOn win.document.body, 'appendChild'
        page.appendChild 1
        expect(win.document.body.appendChild).toHaveBeenCalledWith 1
    it 'passes removeChild through to window.document.body.removeChild', =>
        spyOn win.document.body, 'removeChild'
        page.removeChild 1
        expect(win.document.body.removeChild).toHaveBeenCalledWith 1
    it 'passes setInterval through to window.setInterval', =>
        spyOn win, 'setInterval'
        page.setInterval 1, 2
        expect(win.setInterval).toHaveBeenCalledWith 1, 2
    it 'passes clearInterval through to window.clearInterval', =>
        spyOn win, 'clearInterval'
        page.clearInterval 1
        expect(win.clearInterval).toHaveBeenCalledWith 1

