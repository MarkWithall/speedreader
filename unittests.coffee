createText = () ->
    testContent = document.createElement 'div'
    testContent.id = 'testContent'
    header = document.createElement 'h1'
    para = document.createElement 'p'
    header.innerHTML = 'Test content'
    para.innerHTML = 'This is a test!'
    testContent.appendChild header
    testContent.appendChild para
    document.body.appendChild testContent

removeText = () ->
    testContent = document.getElementById 'testContent'
    if (testContent != null)
        document.body.removeChild testContent

selectText = (element) ->
    doc = document
    text = doc.getElementById element, range, selection
    if (doc.body.createTextRange) #ms
        range = doc.body.createTextRange()
        range.moveToElementText text
        range.select()
    else if (window.getSelection) #all others
        selection = window.getSelection()
        range = doc.createRange()
        range.selectNodeContents text
        selection.removeAllRanges()
        selection.addRange range

module 'Page'

test 'simpleSelection', () ->
    createText()
    selectText 'testContent'
    result = new Page(window, document).getSelectedText()
    notEqual result.indexOf("Test content", 0), -1
    notEqual result.indexOf("This is a test!", 0), -1
    removeText()

module 'splitIntoWords'

test 'simpleTest', () ->
    result = splitIntoWords "a b c d"
    deepEqual result, ['a', 'b', 'c', 'd']

module 'SrDialog'

test 'keypress', () ->
    page = new Page window, document
    dialog = new SrDialog page, new ElementCreator(page)
    dialog.create()
    SPACE_KEY_CODE = 32
    spaceDetected = false
    dialog.addKeyEvent SPACE_KEY_CODE, () ->
        spaceDetected = true
        return
    evt = jQuery.Event "keydown"
    evt.keyCode = SPACE_KEY_CODE
    $("#srDialog").trigger(evt)
    dialog.remove()
    ok(spaceDetected)
    dialog.clearKeyEvents()

module 'splitIntoSentences'

test 'basicSplit', () ->
    input = "This is a test. Is a test! A test?"
    expectedOutput = [ \
        ['This', 'is', 'a', 'test.', '' ], \
        ['Is', 'a', 'test!', ''], \
        ['A', 'test?', ''] ]
    result = splitIntoSentences input
    deepEqual result, expectedOutput

test 'advancedSplit', () ->
    input = 'This is test. "Still a test!" More test???'
    expectedOutput = [ \
        ['This', 'is', 'test.', ''], \
        ['"Still', 'a', 'test!"', ''], \
        ['More', 'test???', ''] ]
    result = splitIntoSentences input
    deepEqual result, expectedOutput

test 'emptyString', () ->
    result = splitIntoSentences ''
    deepEqual result, [ ]

module 'WpmConverter'

test '100wpm', () =>
    equal 600, WpmConverter.toTimeout 100

test '300wpm', () =>
    equal 200, WpmConverter.toTimeout 300

test '550wpm', () =>
    equal 109, WpmConverter.toTimeout 550

