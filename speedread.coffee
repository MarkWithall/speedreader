'use strict'

class Page
    constructor: (@win) ->
        @doc = @win.document
        @body = @doc.body
        @event = @win.event

    createElement: (type) ->
        @doc.createElement type

    appendChild: (child) ->
        @body.appendChild child

    removeChild: (child) ->
        @body.removeChild child

    getSelectedText: ->
        if @win.getSelection
            return @win.getSelection().toString()
        if @doc.getSelection
            return @doc.getSelection()
        if @doc.selection
            return @doc.selection.createRange().text
        ''

    setInterval: (callback, time) ->
        @win.setInterval callback, time

    clearInterval: (interval) ->
        @win.clearInterval interval

class Splitter
    @stringReverse: (str) ->
        str.split('').reverse().join('')

    @stringNotEmpty: (str) ->
        str isnt ''

    @splitIntoWords: (text) ->
        text.split(/\s+/).filter(Splitter.stringNotEmpty)

    @arrayNotEmpty: (array) ->
        array.length > 0

    @appendEmptyElement: (array) ->
        array.concat ''

    @splitIntoSentences: (text) ->
        @stringReverse(text) \
            .split(/(?=[\s\n\r]+["']?[.?!]+)/) \
            .map(Splitter.stringReverse) \
            .reverse() \
            .map(Splitter.splitIntoWords) \
            .filter(Splitter.arrayNotEmpty) \
            .map(Splitter.appendEmptyElement)

class TextSplitter
    constructor: (@sentences) ->
        @sentence = 0
        @word = 0

    hasNext: -> @sentence < @sentences.length

    nextWord: ->
        nextWord = @sentences[@sentence][@word]
        @word += 1
        if @word is @sentences[@sentence].length
            @word = 0
            @sentence += 1
        nextWord

class ElementCreator
    constructor: (@page) ->

    createCssText = (css) ->
        cssProperties = for key, val of css when css.hasOwnProperty key
            key + ':' + val
        cssProperties.join ';'

    create: (type, id, css) ->
        elem = @page.createElement type
        elem.id = id
        elem.style.cssText = createCssText css
        elem

    createDiv: (id, css) -> @create 'div', id, css

    createPara: (id, css) -> @create 'p', id, css

class SrDialog
    constructor: (@page, @elementCreator) ->
        @dialog = null
        @p = null
        @keyEvents = {}

    create: ->
        @dialog = @elementCreator.createDiv 'srDialog', {
            'background-color': 'white',
            'opacity': '.95',
            'filter': 'alpha(opacity=95)',
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'z-index': '1000'
        }

        @dialog.tabIndex = 0

        @p = @elementCreator.createPara 'srWord', {
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
        }

        @p.innerHTML = ''
        @dialog.appendChild @p
        @page.appendChild @dialog
        @dialog.focus()

    remove: -> @page.removeChild @dialog unless @dialog is null

    onKeyDown: (evt) ->
        evt = evt or @page.event
        if @keyEvents.hasOwnProperty evt.keyCode
            @keyEvents[evt.keyCode]()
            if evt.preventDefault
                evt.preventDefault()
            else
                event.returnValue = false

    onKeyPress: (evt) ->
        evt = evt or @page.event
        not @keyEvents.hasOwnProperty evt.keyCode

    addKeyEvent: (key, action) ->
        if @dialog.onkeydown is null
            @dialog.onkeydown = (evt) => @onKeyDown evt
            @dialog.onkeypress = (evt) => @onKeyPress evt
        @keyEvents[key] = action

    clearKeyEvents: ->
        @keyEvents.length = 0

    showWord: (word) ->
        @p.innerHTML = word

class WordDisplayer
    constructor: (@words, @srDialog, @finished) ->

    nextWord: ->
        if @words.hasNext()
            @srDialog.showWord @words.nextWord()
        else
            @finished()

class Looper
    constructor: (@page, @callback, @time) ->
        @interval = null

    start: -> @interval = @page.setInterval @callback, @time

    stop: -> @page.clearInterval @interval

class SpeedReader
    constructor: (@page, @dialog, @interval) ->
        @looper = null
        @playing = true
        @ESCAPE_KEY_CODE = 27
        @SPACE_KEY_CODE = 32

    finish: ->
        @looper.stop()
        @dialog.remove()

    pauseResume: ->
        if @playing
            @looper.stop()
        else
            @looper.start()
        @playing = not @playing

    handleKeyPresses: ->
        @dialog.addKeyEvent @ESCAPE_KEY_CODE, () => @finish()
        @dialog.addKeyEvent @SPACE_KEY_CODE, () => @pauseResume()

    displayWords: (words) ->
        displayer = new WordDisplayer words, @dialog, () => @finish()
        @looper = new Looper @page, (() => displayer.nextWord()), @interval
        @looper.start()

class WpmConverter
    @toInterval: (wpm) ->
        Math.round 60000 / wpm

speedRead = (win, wpm) ->
    page = new Page(win)
    sentences = Splitter.splitIntoSentences page.getSelectedText()
    return if sentences.length is 0
    words = new TextSplitter sentences

    elementCreator = new ElementCreator page
    dialog = new SrDialog page, elementCreator
    dialog.create()

    interval = WpmConverter.toInterval wpm
    sr = new SpeedReader page, dialog, interval
    sr.handleKeyPresses()
    sr.displayWords words
    return

if exports?
    exports.Page = Page
else
    win = this
    win['speedRead'] = speedRead
    speedRead win, 350

